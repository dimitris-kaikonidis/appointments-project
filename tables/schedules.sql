DROP TABLE IF EXISTS schedules;

CREATE TABLE schedules(
    id SERIAL PRIMARY KEY,
    start VARCHAR(255),
    finish VARCHAR(255),
    daysOff INT ARRAY,
    business_id INT NOT NULL REFERENCES businesses(id) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);