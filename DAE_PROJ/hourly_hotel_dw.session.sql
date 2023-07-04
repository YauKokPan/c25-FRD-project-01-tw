DROP TABLE IF EXISTS stg_login_breakdown;
DROP TABLE IF EXISTS stg_cpi;
DROP TABLE IF EXISTS stg_passenger_traffic;
DROP TABLE IF EXISTS stg_navigation;
DROP TABLE IF EXISTS stg_search;
DROP TABLE IF EXISTS stg_booking;
DROP TABLE IF EXISTS fact_cpis;
DROP TABLE IF EXISTS fact_passenger_traffics;
DROP TABLE IF EXISTS fact_login_breakdowns;
DROP TABLE IF EXISTS fact_navigations;
DROP TABLE IF EXISTS fact_searches;
DROP TABLE IF EXISTS fact_bookings;
DROP TABLE IF EXISTS fact_access_breakdowns;
DROP TABLE IF EXISTS dim_page;
DROP TABLE IF EXISTS dim_payment;
DROP TABLE IF EXISTS dim_hotel;
DROP TABLE IF EXISTS dim_user;
DROP TABLE IF EXISTS dim_time;
DROP TABLE IF EXISTS dim_date; 

CREATE TABLE dim_user(
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255),
    is_admin boolean,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE unique index idx_dim_user on dim_user (user_name, is_admin);


CREATE TABLE dim_hotel(
    id SERIAL PRIMARY KEY,
    hotel_name VARCHAR(255),
    hotel_address VARCHAR(255),
    district VARCHAR(255),
    total_rooms INTEGER,
    hourly_rate INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE unique index idx_dim_hotel on dim_hotel (hotel_name, hotel_address, district);


CREATE TABLE dim_payment(
    id SERIAL PRIMARY KEY,
    payment_method VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE unique index idx_dim_payment on dim_payment (payment_method);


CREATE TABLE fact_bookings(
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES dim_user(id),
    hotel_id INTEGER,
    FOREIGN KEY (hotel_id) REFERENCES dim_hotel(id),
    payment_id INTEGER,
    FOREIGN KEY (payment_id) REFERENCES dim_payment(id),
    bk_start_time TIMESTAMP,
    bk_end_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fact_login_breakdowns(
    id SERIAL PRIMARY KEY,
    login_time TIMESTAMP,
    ip VARCHAR(255),
    device VARCHAR(255),
    os VARCHAR(255),
    browser VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES dim_user(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fact_passenger_traffics(
    id SERIAL PRIMARY KEY,
    arrival_date DATE,
    arrival_hk INTEGER,
    arrival_ml INTEGER,
    arrival_other INTEGER
);


CREATE TABLE fact_cpis(
    id SERIAL PRIMARY KEY,
    cpi_date DATE,
    cpi_class VARCHAR(255),
    item VARCHAR(255),
    index DECIMAL(8,1)
);


CREATE TABLE stg_booking(
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255),
    is_admin boolean,
    hotel_name VARCHAR(255),
    hotel_address VARCHAR(255),
    district VARCHAR(255),
    total_rooms INTEGER,
    hourly_rate INTEGER,
    payment_method VARCHAR(255),
    bk_start_time TIMESTAMP,
    bk_end_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE stg_login_breakdown(
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255),
    is_admin boolean,
    login_time TIMESTAMP,
    ip VARCHAR(255),
    device VARCHAR(255),
    os VARCHAR(255),
    browser VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- CREATE FUNCTION for insert fact_bookings FROM stg_booking
CREATE OR REPLACE FUNCTION insert_fact_bookings()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
    DECLARE
        dim_user_id INT := 0;
        dim_hotel_id INT := 0;
        dim_payment_id INT :=0;
    BEGIN
        INSERT INTO dim_user
            (user_name, is_admin)
            VALUES
            (NEW.user_name, NEW.is_admin)
            ON CONFLICT (user_name, is_admin)
            DO 
                UPDATE SET created_at=NEW.created_at
                RETURNING id
                INTO dim_user_id;
        INSERT INTO dim_hotel
            (hotel_name, hotel_address, district, total_rooms, hourly_rate, created_at)
            VALUES
            (NEW.hotel_name, NEW.hotel_address, NEW.district, NEW.total_rooms, NEW.hourly_rate, NEW.created_at)
            ON CONFLICT (hotel_name, hotel_address, district)
            DO 
                UPDATE SET created_at=NEW.created_at
                RETURNING id
                INTO dim_hotel_id;
        INSERT INTO dim_payment
            (payment_method)
            VALUES
            (NEW.payment_method)
            ON CONFLICT (payment_method)
            DO
                UPDATE SET created_at=NEW.created_at
                RETURNING id
                INTO dim_payment_id;
        INSERT INTO fact_bookings (
            user_id,
            hotel_id,
            payment_id,
            bk_start_time,
            bk_end_time
            )
            VALUES (
            dim_user_id,
            dim_hotel_id,
            dim_payment_id,
            NEW.bk_start_time,
            NEW.bk_end_time
          );
        RETURN NEW;
    END;
$$;
DROP TRIGGER IF EXISTS trigger_insert_fact_bookings ON stg_booking CASCADE; 
CREATE TRIGGER trigger_insert_fact_bookings
AFTER INSERT ON stg_booking
FOR EACH ROW
EXECUTE PROCEDURE insert_fact_bookings();

-- CREATE FUNCTION for insert fact_login_breakdowns FROM stg_login_breakdown
CREATE OR REPLACE FUNCTION insert_fact_login_breakdowns()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
    DECLARE
        dim_user_id INT := 0;
    BEGIN
        INSERT INTO dim_user
            (user_name, is_admin)
            VALUES
            (NEW.user_name, NEW.is_admin)
            ON CONFLICT (user_name, is_admin)
            DO 
                UPDATE SET created_at=NEW.created_at
                RETURNING id
                INTO dim_user_id;
        INSERT INTO fact_login_breakdowns (
            login_time,
            user_id,
            ip,
            browser,
            os,
            device
            )
        VALUES (
            NEW.login_time,
            dim_user_id,
            NEW.ip,
            NEW.browser,
            NEW.os,
            NEW.device
        );
        RETURN NEW;
    END;
$$;

DROP TRIGGER IF EXISTS trigger_insert_fact_breakdowns ON stg_login_breakdown CASCADE; 
CREATE TRIGGER trigger_insert_fact_login_breakdowns
AFTER INSERT ON stg_login_breakdown
FOR EACH ROW
EXECUTE PROCEDURE insert_fact_login_breakdowns();


------------------------------------
-- insert sample in fact_bookings --
------------------------------------

INSERT INTO stg_booking (user_name, is_admin, hotel_name, hotel_address, district, total_rooms, hourly_rate, payment_method, bk_start_time, bk_end_time)
SELECT
    'user' || subquery.id,
    CAST(RANDOM() < 0.5 AS BOOLEAN),
    dim_hotel.hotel_name,
    dim_hotel.hotel_address,
    dim_hotel.district,
    dim_hotel.total_rooms,
    dim_hotel.hourly_rate,
    CASE FLOOR(RANDOM() * 3)
        WHEN 0 THEN 'Credit Card'
        WHEN 1 THEN 'Debit Card'
        ELSE 'Paypal'
    END,
    subquery.bk_start_time,
    CASE
        WHEN EXTRACT(HOUR FROM subquery.bk_start_time) IN (20, 21, 22) THEN DATE_TRUNC('day', subquery.bk_start_time + INTERVAL '1 day') + INTERVAL '23 hour'
        WHEN EXTRACT(HOUR FROM subquery.bk_start_time) = 23 THEN DATE_TRUNC('day', subquery.bk_start_time + INTERVAL '1 day') + INTERVAL '7 hour'
        WHEN EXTRACT(HOUR FROM subquery.bk_start_time) >= 0 AND EXTRACT(HOUR FROM subquery.bk_start_time) < 7 THEN DATE_TRUNC('day', subquery.bk_start_time) + INTERVAL '7 hour'
        ELSE subquery.bk_start_time + INTERVAL '2 hour' + INTERVAL '1 hour' * FLOOR(RANDOM() * 2)
    END
FROM (
    SELECT
        id,
        TIMESTAMP '2020-01-01 07:00:00' + (FLOOR(RANDOM() * (DATE_PART('day', NOW() - TIMESTAMP '2020-01-01 07:00:00') + 1))) * INTERVAL '1 day' + (FLOOR(RANDOM() * 17)) * INTERVAL '1 hour' AS bk_start_time
    FROM generate_series(1, 20000) AS id
) AS subquery
INNER JOIN dim_hotel ON dim_hotel.id = (subquery.id % 147) + 1
WHERE EXTRACT(HOUR FROM subquery.bk_start_time) >= 7 AND EXTRACT(HOUR FROM subquery.bk_start_time) < 23;

-- ----------------------

INSERT INTO stg_booking (user_name, is_admin, hotel_name, hotel_address, district, total_rooms, hourly_rate, payment_method, bk_start_time, bk_end_time)
SELECT
    'user' || subquery.id,
    CAST(RANDOM() < 0.5 AS BOOLEAN),
    dim_hotel.hotel_name,
    dim_hotel.hotel_address,
    dim_hotel.district,
    dim_hotel.total_rooms,
    dim_hotel.hourly_rate,
    CASE FLOOR(RANDOM() * 3)
        WHEN 0 THEN 'Credit Card'
        WHEN 1 THEN 'Debit Card'
        ELSE 'Cash'
    END,
    subquery.bk_start_time,
    DATE_TRUNC('day', subquery.bk_start_time + INTERVAL '1 day') + INTERVAL '7 hour' AS bk_end_time
FROM (
    SELECT
        id,
        TIMESTAMP '2020-01-01 23:00:00' + (FLOOR(RANDOM() * (DATE_PART('day', NOW() - TIMESTAMP '2020-01-01 23:00:00') + 1))) * INTERVAL '1 day' AS bk_start_time
    FROM generate_series(1, 1000) AS id
) AS subquery
INNER JOIN dim_hotel ON dim_hotel.id = (subquery.id % 147) + 1;

INSERT INTO stg_login_breakdown
    (user_name, is_admin, login_time, ip, device, os, browser)
SELECT 
    user_name,
    is_admin,
    TIMESTAMP '2020-01-01' + INTERVAL '1 second' * (a.id - 1) AS login_time,
    '192.168.' || (a.id % 256) || '.' || (a.id % 256) AS ip,
    CASE WHEN a.id % 2 = 0 THEN 'Desktop' ELSE 'Mobile' END AS device,
    CASE WHEN a.id % 3 = 0 THEN 'Windows' WHEN a.id % 3 = 1 THEN 'Mac' ELSE 'Linux' END AS os,
    CASE WHEN a.id % 2 = 0 THEN 'Chrome' ELSE 'Firefox' END AS browser
FROM 
    generate_series(1, 1000) a(id)
JOIN 
    dim_user 
ON 
    a.id % (SELECT COUNT(*) FROM dim_user) + 1 = dim_user.id;