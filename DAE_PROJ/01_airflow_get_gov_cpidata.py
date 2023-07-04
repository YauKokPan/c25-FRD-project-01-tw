from airflow.utils.dates import days_ago
from airflow.operators.python_operator import PythonOperator
from airflow import DAG
from psycopg2.extras import execute_values
import psycopg2
import json
import urllib.request
from datetime import datetime
import os
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
    '01_fetch_cpi_data',
    default_args=default_args,
    description='Fetch CPI data from HK Gov API and store it in PostgreSQL',
    schedule_interval="@monthly"
)

def fetch_cpi_data():
    url_path = "https://www.censtatd.gov.hk/api/get.php?id=510-60003&lang=en&param=N4KABGBEDGBukC4yghSBhA8gSSwBUTAG1xU0BGSAGlLMgCZrbVIBmJstAFg88gFZedAGxCWAdjFoAHFKgBOOZHIAGJeUo1OUcoy19y7ZgF1SAX32QAzvCQoWAIQD66ALJPy8+mqQltkACUAQwB3DwATAAcnAEtwgA8nADtIE300dBd3T29CPz5gsPIo2ITk1LJjdKgAQSyPLx9iZjRCiOi4xJSTc0tIgFMAJxiAe3DCezQrABcgwenCBhV6VUpe0kg4xf5VAFphFUP2SwAbIKSAc0X+7rMgA"

    with urllib.request.urlopen(url_path) as url:
        s = url.read().decode("utf8")

    conn = psycopg2.connect(dbname=WAREHOUSE_DB, user=WAREHOUSE_USER, password=WAREHOUSE_PASSWORD, host=WAREHOUSE_HOST)
    cur = conn.cursor()

    # Load the JSON data into a Python dictionary
    data = json.loads(s)
    # Access the dataSet array
    cpi_data_set = data['dataSet']

    # Prepare a list of tuples to insert into the database
    rows_to_insert = []

    # Iterate over the items in the dataSet array
    for item in cpi_data_set:
        if len(item['period']) == 4:
            continue
        date_obj = datetime.strptime(item['period'], '%Y%m').replace(day=1).date()
        coicop_desc = item['COICOPDesc']
        sv = item['sv'][0]
        figure = item['figure']

        # Check if the data already exists in the database
        cur.execute("SELECT COUNT(*) FROM fact_cpis WHERE cpi_date=%s AND cpi_class=%s AND item=%s", (date_obj, sv, coicop_desc))
        count = cur.fetchone()[0]

        # If the data already exists, skip inserting it
        if count > 0:
            continue

        # Otherwise, add the data to the list of rows to insert
        rows_to_insert.append((date_obj, sv, coicop_desc, figure))

    # If there are no new rows to insert, print a message and exit the function
    if not rows_to_insert:
        print("No new data inserted.")
        return

    # Define the SQL query to insert the rows
    query = "INSERT INTO fact_cpis (cpi_date, cpi_class, item, index) VALUES %s ON CONFLICT DO NOTHING"

    # Execute the query with the list of tuples as the parameter
    execute_values(cur, query, rows_to_insert)

    # Commit the changes
    conn.commit()

    # Close the cursor and database connection
    cur.close()
    conn.close()

    # Print the number of rows inserted
    print(f"{len(rows_to_insert)} new rows inserted.")

fetch_cpi_data_operator = PythonOperator(
    task_id='fetch_cpi_data',
    python_callable=fetch_cpi_data,
    dag=dag
)