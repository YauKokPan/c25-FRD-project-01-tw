DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    phone VARCHAR(255),
    is_admin boolean,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE hotels(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255),
    district VARCHAR(255),
    phone VARCHAR(255),
    profile_pic VARCHAR(255),
    description TEXT,
    total_rooms INTEGER,
    hourly_rate INTEGER,
    is_deleted boolean,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bookings(
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    hotel_id INTEGER,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    total_hours INTEGER,
    total_prices INTEGER,
    phone VARCHAR(255),
    email VARCHAR(255),
    remarks VARCHAR(255)
);

CREATE TABLE payments(
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    booking_id INTEGER,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    is_completed boolean,
    method VARCHAR(255)
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    hotel_id INTEGER,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    comment_text VARCHAR(255),
    rating INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    is_deleted boolean,
    nick_name VARCHAR(255)
);

CREATE TABLE gallery(
    id SERIAL PRIMARY KEY,
    hotel_id INTEGER,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    hotel_img VARCHAR(255)
);
