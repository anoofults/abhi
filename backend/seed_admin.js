const pool = require('./db');
const bcrypt = require('bcrypt');

async function seedAdmin() {
    try {
        const password = 'admin123'; // Default password
        const hashedPassword = await bcrypt.hash(password, 8);

        const res = await pool.query(
            "INSERT INTO users (name, email, password, role, phone, blood_type) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING RETURNING *",
            ['Admin User', 'admin@example.com', hashedPassword, 'admin', '0000000000', 'O+']
        );

        if (res.rows.length > 0) {
            console.log('Admin user created successfully.');
            console.log('Email: admin@example.com');
            console.log('Password: ' + password);
        } else {
            console.log('Admin user already exists.');
        }
    } catch (err) {
        console.error('Error seeding admin:', err);
    } finally {
        pool.end();
    }
}

seedAdmin();
