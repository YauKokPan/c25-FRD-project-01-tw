from kafka import KafkaConsumer
import json
from dotenv import load_dotenv
import os
import psycopg2
from datetime import datetime

load_dotenv()

dw_host=os.getenv('host')
dw_port=os.getenv('port')
dw_dbname=os.getenv('dbname')
dw_user=os.getenv('user')
dw_password=os.getenv('password')

conn = psycopg2.connect(
    host=dw_host,
    port=dw_port,
    dbname=dw_dbname,
    user=dw_user,
    password=dw_password
)

cur = conn.cursor()

consumer = KafkaConsumer(bootstrap_servers=['34.87.101.69:9092'],
                         value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                         auto_offset_reset='earliest',
                         enable_auto_commit=True,
                         group_id='gp-1')

topics = ['user-logins', 'access-log']
consumer.subscribe(topics=topics)

login_insert_sql = """
INSERT INTO stg_login_breakdown
(user_name, is_admin, ip, os, browser, login_time, device)
VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

access_insert_sql = """
INSERT INTO fact_access_breakdowns
(ip, os, device, browser, method, status_code, url, res_size, access_time)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

for message in consumer:
    try:
        value = message.value
        print("value:", value)
        
        if message.topic == 'user-logins':
            user_name = value.get('name')
            is_admin = value.get('is_admin')
            ip = value.get('ip')
            operating_system = value.get('os')
            browser = value.get('browser')
            login_time = value.get('login_time')
            device = value.get('device')
            cur.execute(login_insert_sql, (user_name, is_admin, ip, operating_system, browser, login_time, device))
            print(f"Inserted login record: {message.topic} ({message.offset}): {message.value}")
        
        elif message.topic == 'access-log':
            ip = value.get('ip')
            operating_system = value.get('os')
            device = value.get('device')
            browser = value.get('browser')
            method = value.get('method')
            status = value.get('status')
            url = value.get('url')
            res_size = value.get('res_size')
            access_time = value.get('access_time')
            cur.execute(access_insert_sql, (ip, operating_system, device, browser, method, status, url, res_size, access_time))
            print(f"Inserted access record: {message.topic} ({message.offset}): {message.value}")
        
        conn.commit()
    except Exception as e:
        print('error', e)