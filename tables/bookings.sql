DROP TABLE IF EXISTS bookings;

CREATE TABLE bookings(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    date VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    status VARCHAR(30),
    code VARCHAR(5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);