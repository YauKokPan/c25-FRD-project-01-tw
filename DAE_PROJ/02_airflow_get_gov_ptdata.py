from airflow.utils.dates import days_ago
from airflow.operators.python_operator import PythonOperator
from airflow import DAG
import requests
import os
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
import pip
pip.main(['install', 'python-dotenv'])
from dotenv import load_dotenv
load_dotenv()

WAREHOUSE_HOST = os.getenv("WAREHOUSE_HOST")
WAREHOUSE_DB = os.getenv("WAREHOUSE_DB")
WAREHOUSE_USER = os.getenv("WAREHOUSE_USER")
WAREHOUSE_PASSWORD = os.getenv("WAREHOUSE_PASSWORD")

default_args = {
    'owner': 'airflow',
    'start_date': days_ago(1)
}

dag = DAG(
    '02_fetch_passenger_traffic_data',
    default_args=default_args,
    description='Fetch passenger traffic data from HK Gov API and store it in PostgreSQL',
    schedule_interval="@daily"
)

def fetch_passenger_traffic_data():

    try:

        conn = psycopg2.connect(dbname=WAREHOUSE_DB, user=WAREHOUSE_USER,
                                password=WAREHOUSE_PASSWORD, host=WAREHOUSE_HOST)

        cur = conn.cursor()

        # Set the URL of the CSV file
        url = "https://www.immd.gov.hk/opendata/eng/transport/immigration_clearance/statistics_on_daily_passenger_traffic.csv"

        # Set the local filename of the CSV file
        filename = "/opt/airflow/data/data.csv"

        # Download the CSV file from the URL
        response = requests.get(url)

        # If the request was successful, save the CSV data to a file
        if response.status_code == 200:
            with open(filename + "_temp", "wb") as f:
                f.write(response.content)

        # If the file already exists, replace it with the new data
        if os.path.exists(filename):
            os.remove(filename)
        if os.path.exists(filename + "_temp"):
            os.rename(filename + "_temp", filename)

        # Load the CSV data into a Pandas DataFrame
        df = pd.read_csv('/opt/airflow/data/data.csv', delimiter=',')

        # Filter the DataFrame to only keep rows with "arrival" in the "Arrival / Departure" column
        df = df[df['Arrival / Departure'] == 'Arrival']

        # Drop the "Unnamed: 7" column if it exists
        if 'Unnamed: 7' in df.columns:
            df = df.drop('Unnamed: 7', axis=1)

        df.to_csv('/opt/airflow/data/data.csv')
        print(df.dtypes)
        # Aggregate the data by date and sum the relevant columns
        df_totals = df.pivot_table(index='Date', values=[
                                   'Hong Kong Residents', 'Mainland Visitors', 'Other Visitors', 'Total'],  aggfunc='sum')

        # Sort the data by year
        df_sorted = df_totals.sort_values(
            by='Date', key=lambda x: pd.to_datetime(x, format='%d-%m-%Y'))

        # Drop the "Total" column
        df_sorted = df_sorted.drop('Total', axis=1)

        df_sorted = df_sorted.rename(columns={'Hong Kong Residents': 'arrival_hk',
                                     'Mainland Visitors': 'arrival_ml', 'Other Visitors': 'arrival_other'})

        # Rename the index column to "arrival_date"
        df_sorted = df_sorted.rename_axis('arrival_date').reset_index()

        # Convert the 'arrival_date' column to a datetime data type
        df_sorted['arrival_date'] = pd.to_datetime(df_sorted['arrival_date'], format='%d-%m-%Y')

        # Save the sorted data to a new CSV file
        df_sorted.to_csv('/opt/airflow/data/data_aggregated_sorted.csv', index=False, header=False)

        # Load the existing data from the database
        table_name = 'fact_passenger_traffics'
        query = f"SELECT arrival_date, arrival_hk, arrival_ml, arrival_other FROM {table_name}"
        cur.execute(query)
        rows = cur.fetchall()

        # Convert the rows to a Pandas DataFrame
        df_db = pd.DataFrame(rows, columns=['arrival_date', 'arrival_hk', 'arrival_ml', 'arrival_other'])

        # Convert the 'arrival_date' column to a datetime data type
        df_db['arrival_date'] = pd.to_datetime(df_db['arrival_date'], format='%Y-%m-%d')

        # Merge the two DataFrames on the 'arrival_date' column
        df_merged = pd.merge(df_sorted, df_db, on='arrival_date', how='outer', suffixes=('_new', '_old'))

        # Replace missing values in the 'arrival_hk', 'arrival_ml', and 'arrival_other' columns with 0
        df_merged[['arrival_hk_new', 'arrival_ml_new', 'arrival_other_new', 'arrival_hk_old', 'arrival_ml_old', 'arrival_other_old']] = df_merged[['arrival_hk_new', 'arrival_ml_new', 'arrival_other_new',     'arrival_hk_old', 'arrival_ml_old', 'arrival_other_old']].fillna(0)

        # Calculate the total number of rows to insert
        num_rows = len(df_merged) - len(df_db)

        # If there are no new rows to insert, print a message and exit
        if num_rows == 0:
            print("No new rows to insert.")
            cur.close()
            conn.close()
            return

        # Extract the new rows to insert
        df_to_insert = df_merged[df_merged['arrival_hk_old'] == 0]

        # Convert the new rows to a list of tuples
        values = [tuple(x) for x in df_to_insert[['arrival_date', 'arrival_hk_new', 'arrival_ml_new',   'arrival_other_new']].to_numpy()]

        # Insert the new rows into the database
        columns = ('arrival_date', 'arrival_hk', 'arrival_ml', 'arrival_other')
        query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES %s"
        execute_values(cur, query, values)

        # Commit the changes to the database
        conn.commit()

        # Print a message indicating the number of rows inserted
        print(f"{num_rows} new rows inserted into the database.")

        # Close the cursor and database connection
        cur.close()
        conn.close()

    except Exception as e:
        # Handle the exception here, for example by logging the error message
        print(f"An error occurred: {str(e)}")

fetch_passenger_traffic_data_operator = PythonOperator(
    task_id='fetch_passenger_traffic_data',
    python_callable=fetch_passenger_traffic_data,
    dag=dag
)