const { Pool } = require("pg");
const params = {
    user: "dim107",
    host: "localhost",
    database: "appointments",
    password: "postgres",
    port: 5432,
};

// const db = new Pool(params);

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports.addBusiness = (name, email, phone, password) =>
    db.query(
        `INSERT INTO businesses (name, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING *;`,
        [name, email, phone, password]
    );

module.exports.findBusiness = (email) =>
    db.query(`SELECT * FROM businesses WHERE email = $1`, [email]);

module.exports.findBusinesses = (query) => {
    return db.query(
        `
        SELECT id, name, email, phone
        FROM businesses 
        WHERE name ILIKE $1 
        ORDER BY name
        LIMIT 5;
        `,
        ["%" + query + "%"]
    );
};

module.exports.getBusinessInfo = (name) =>
    db.query(
        `
        SELECT business_id, name, email, phone, start, finish, daysOff FROM businesses 
        JOIN schedules 
        ON (businesses.id = schedules.business_id)
        WHERE name = $1;
        `,
        [name]
    );

module.exports.setSchedule = (start, finish, daysOff, id) =>
    db.query(
        `
        INSERT INTO schedules (start, finish, daysOff, business_id) VALUES ($1, $2, $3, $4)
        ON CONFLICT (business_id)
        DO 
        UPDATE SET start = $1, finish = $2, daysOff = $3;
        `,
        [start, finish, daysOff, id]
    );

module.exports.getSchedule = (id) =>
    db.query(`SELECT * FROM schedules WHERE business_id = $1;`, [id]);

module.exports.makeBooking = (business_name, phone, email, name, date) =>
    db.query(
        `
        INSERT INTO bookings (business_name, phone, email, name, date, status) VALUES ($1, $2, $3, $4, $5, $6);
        `,
        [business_name, phone, email, name, date, "pending"]
    );

module.exports.getBookings = (name) =>
    db.query(`SELECT date FROM bookings WHERE business_name = $1;`, [name]);

module.exports.getBookingsBusiness = (name) =>
    db.query(`SELECT * FROM bookings WHERE business_name = $1;`, [name]);

module.exports.getRequests = (name) =>
    db.query(`SELECT * FROM bookings WHERE business_name = $1;`, [name]);

module.exports.updateRequest = (id, status, code = "") =>
    db.query(`UPDATE bookings SET status = $2, code = $3 WHERE id = $1`, [
        id,
        status,
        code,
    ]);
