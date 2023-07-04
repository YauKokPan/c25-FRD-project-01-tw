from pyspark.sql import SparkSession
import os
import schedule
import time


def run_etl():
    packages = [
        "com.amazonaws:aws-java-sdk-ec2:1.12.95",
        "org.apache.spark:spark-core_2.13:3.2.0",
        "org.apache.spark:spark-sql_2.13:3.2.2",
        "org.postgresql:postgresql:42.6.0"
    ]

# better use spark://spark:7077')

    spark = SparkSession.builder.appName("Transform from ec2 db to gcp db to gcp dw")\
        .master("spark://spark:7077")\
        .config("spark.jars.packages", ",".join(packages))\
        .getOrCreate()

    # define the JDBC connection parameters for the source and destination databases
    source_jdbc_ec2_appdb_url = "jdbc:postgresql://54.144.144.35:5432/sweethour"
    source_jdbc_ec2_appdb_properties = {"user": "kokpanyau",
                                        "password": "kokpanyau", "driver": "org.postgresql.Driver"}

    dest_jdbc_gcp_appdb_url = "jdbc:postgresql://applicationdb:5432/hourly_hotel_appdb"
    dest_jdbc_gcp_appdb_properties = {"user": "postgres",
                                      "password": "postgres", "driver": "org.postgresql.Driver"}

    dest_jdbc_gcp_dw_url = "jdbc:postgresql://datawarehouse:5432/hourly_hotel_dw"
    dest_jdbc_gcp_dw_properties = {"user": "postgres",
                                   "password": "postgres", "driver": "org.postgresql.Driver"}

    # Extract
    print(
        '------------------------------- [EXTRACT] Reading from AWS EC2 appdb -------------------------------')
    source_user_df = spark.read.jdbc(
        source_jdbc_ec2_appdb_url, "users", properties=source_jdbc_ec2_appdb_properties
    )

    source_hotel_df = spark.read.jdbc(
        source_jdbc_ec2_appdb_url, "hotels", properties=source_jdbc_ec2_appdb_properties
    )

    source_booking_df = spark.read.jdbc(
        source_jdbc_ec2_appdb_url, "bookings", properties=source_jdbc_ec2_appdb_properties
    )

    source_payment_df = spark.read.jdbc(
        source_jdbc_ec2_appdb_url, "payments", properties=source_jdbc_ec2_appdb_properties
    )

    source_comment_df = spark.read.jdbc(
        source_jdbc_ec2_appdb_url, "comments", properties=source_jdbc_ec2_appdb_properties
    )

    source_gallery_df = spark.read.jdbc(
        source_jdbc_ec2_appdb_url, "gallery", properties=source_jdbc_ec2_appdb_properties
    )

    # check if the user already exists in the GCP App DB
    existing_user_df = spark.read.jdbc(dest_jdbc_gcp_appdb_url, "users",
                                       properties=dest_jdbc_gcp_appdb_properties)\
        .select("name", "email", "password", "phone", "is_admin")

    # check if the user already exists in the GCP App DB
    existing_hotel_df = spark.read.jdbc(dest_jdbc_gcp_appdb_url, "hotels",
                                        properties=dest_jdbc_gcp_appdb_properties)\
        .select("name", "address", "district", "phone", "profile_pic", "description", "total_rooms", "hourly_rate", "is_deleted", "user_id")

    existing_booking_df = spark.read.jdbc(dest_jdbc_gcp_appdb_url, "bookings",
                                        properties=dest_jdbc_gcp_appdb_properties)\
        .select("user_id", "hotel_id", "start_time", "end_time", "total_hours", "total_prices", "phone", "email", "remarks")
    
    existing_payment_df = spark.read.jdbc(dest_jdbc_gcp_appdb_url, "payments",
                                        properties=dest_jdbc_gcp_appdb_properties)\
        .select("user_id", "booking_id", "is_completed", "method")
    
    existing_comment_df = spark.read.jdbc(dest_jdbc_gcp_appdb_url, "comments",
                                        properties=dest_jdbc_gcp_appdb_properties)\
        .select("user_id", "hotel_id", "comment_text", "rating", "is_deleted", "nick_name")

    existing_gallery_df = spark.read.jdbc(dest_jdbc_gcp_appdb_url, "gallery",
                                        properties=dest_jdbc_gcp_appdb_properties)\
        .select("hotel_id", "hotel_img")

    # Transform
    print(
        '------------------------------- [TRANSFORM] Transform to dataframe -------------------------------')
    # select only the new users that do not already exist in the GCP App DB

    transformed_user_df = source_user_df.select(
        "name", "email", "password", "phone", "is_admin")

    new_user_df = transformed_user_df.join(
        existing_user_df, ["name", "email", "password", "phone", "is_admin"], "left_anti")

    transformed_hotel_df = source_hotel_df.select(
        "name", "address", "district", "phone", "profile_pic", "description", "total_rooms", "hourly_rate", "is_deleted", "user_id")

    new_hotel_df = transformed_hotel_df.join(
        existing_hotel_df, ["name", "address", "district", "phone", "profile_pic", "description", "total_rooms", "hourly_rate", "is_deleted", "user_id"], "left_anti")

    transformed_booking_df = source_booking_df.select(
        "user_id", "hotel_id", "start_time", "end_time", "total_hours", "total_prices", "phone", "email", "remarks"
    )

    new_booking_df = transformed_booking_df.join(
        existing_booking_df, ["user_id", "hotel_id", "start_time", "end_time", "total_hours", "total_prices", "phone", "email", "remarks"], "left_anti")

    transformed_payment_df = source_payment_df.select(
        "user_id", "booking_id", "is_completed", "method"
    )

    new_payment_df = transformed_payment_df.join(
        existing_payment_df, ["user_id", "booking_id", "is_completed", "method"], "left_anti")

    transformed_comment_df = source_comment_df.select(
        "user_id", "hotel_id", "comment_text", "rating", "is_deleted", "nick_name"
    )

    new_comment_df = transformed_comment_df.join(
        existing_comment_df, ["user_id", "hotel_id", "comment_text", "rating", "is_deleted", "nick_name"], "left_anti")

    transformed_gallery_df = source_gallery_df.select(
        "hotel_id", "hotel_img"
    )

    new_gallery_df = transformed_gallery_df.join(
        existing_gallery_df, ["hotel_id", "hotel_img"], "left_anti")

    # Load
    print(
        '------------------------------- [LOAD] Transform to GCP appdb -------------------------------')
    new_user_df.write.jdbc(dest_jdbc_gcp_appdb_url, "users",
                           mode="append", properties=dest_jdbc_gcp_appdb_properties)

    new_hotel_df.write.jdbc(dest_jdbc_gcp_appdb_url, "hotels",
    mode="append", properties=dest_jdbc_gcp_appdb_properties)

    new_booking_df.write.jdbc(dest_jdbc_gcp_appdb_url, "bookings",
    mode="append", properties=dest_jdbc_gcp_appdb_properties)

    new_payment_df.write.jdbc(dest_jdbc_gcp_appdb_url, "payments",
    mode="append", properties=dest_jdbc_gcp_appdb_properties)

    new_comment_df.write.jdbc(dest_jdbc_gcp_appdb_url, "comments",
    mode="append", properties=dest_jdbc_gcp_appdb_properties)

    new_gallery_df.write.jdbc(dest_jdbc_gcp_appdb_url, "gallery",
    mode="append", properties=dest_jdbc_gcp_appdb_properties)

    print("FINISH")

    # Extract
    print('------------------------------- [EXTRACT] Reading from GCP appdb -------------------------------')
    user_dw_df = spark.read.jdbc(
        dest_jdbc_gcp_appdb_url, "users", properties=dest_jdbc_gcp_appdb_properties
    )

    hotel_dw_df = spark.read.jdbc(
        dest_jdbc_gcp_appdb_url, "hotels", properties=dest_jdbc_gcp_appdb_properties
    )

    print(hotel_dw_df.head(10))
    booking_dw_df = spark.read.jdbc(
        dest_jdbc_gcp_appdb_url, "bookings", properties=dest_jdbc_gcp_appdb_properties
    )

    payment_dw_df = spark.read.jdbc(
        dest_jdbc_gcp_appdb_url, "payments", properties=dest_jdbc_gcp_appdb_properties
    )

    # Transform
    print('------------------------------- [TRANSFORM] Transform to dataframe and join table -------------------------------')
    bookings_users_dw_df = booking_dw_df.join(user_dw_df, booking_dw_df.user_id == user_dw_df.id)
    # print(source_bookings_users_dw_df.head())

    bookings_users_hotels_dw_df = bookings_users_dw_df.join(hotel_dw_df, bookings_users_dw_df.hotel_id == hotel_dw_df.id)

    final_dw_df = bookings_users_hotels_dw_df.join(payment_dw_df, booking_dw_df.id == payment_dw_df.booking_id)

    dw_df = final_dw_df.select(
        # source_bookings_hotels_dw_df['bookings.user_id'],
        user_dw_df['name'].alias('user_name'),
        user_dw_df['is_admin'],
        # source_bookings_hotels_dw_df['bookings.hotel_id'],
        hotel_dw_df['name'].alias('hotel_name'),
        hotel_dw_df['address'].alias('hotel_address'),
        hotel_dw_df['district'],
        hotel_dw_df['total_rooms'],
        hotel_dw_df['hourly_rate'],
        payment_dw_df['method'].alias('payment_method'),
        booking_dw_df['start_time'].alias('bk_start_time'),
        booking_dw_df['end_time'].alias('bk_end_time')
    )

    dw_df = dw_df.distinct()

    print(dw_df.head(10))

    # Load
    print('------------------------------- [LOAD] Transform to GCP DW -------------------------------')
    dw_df.write.jdbc(dest_jdbc_gcp_dw_url, "stg_booking",
                              mode="append", properties=dest_jdbc_gcp_dw_properties)

    spark.stop()


run_etl()

# schedule the ETL process to run every day at 2 AM
schedule.every().day.at('00:01').do(run_etl)

# keep the script running indefinitely to allow the scheduled jobs to run
while True:
    schedule.run_pending()
    time.sleep(1)
