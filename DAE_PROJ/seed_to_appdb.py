import csv
import psycopg2
import os
# Set up database connection
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(
    host='127.0.0.1',
    port='5433',
    dbname='hourly_hotel_dw',
    user='postgres',
    password='postgres'
)

cur = conn.cursor()

# Read data from CSV file
with open('hotels.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        # Format query with data from CSV file
        query = "INSERT INTO dim_hotel (hotel_name, hotel_address, district, total_rooms, hourly_rate) VALUES (%s, %s, %s, %s, %s)"
        values = (row['name'], row['address'], row['district'], row['total_rooms'], row['hourly_rate'])
        
        # Execute query and commit changes to database
        cur.execute(query, values)
        conn.commit()

# Close database connection
cur.close()
conn.close()