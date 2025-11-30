const { Client } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    const dbConfig = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    };

    try {
        // 1. Try to create DB if not exists (requires access to 'postgres' db)
        try {
            const client = new Client({ ...dbConfig, database: 'postgres' });
            await client.connect();
            const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`);
            if (res.rowCount === 0) {
                console.log(`Creating database ${process.env.DB_NAME}...`);
                await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            } else {
                console.log(`Database ${process.env.DB_NAME} already exists.`);
            }
            await client.end();
        } catch (err) {
            console.log('Skipping database creation check (might already exist or no permission to postgres db).');
            // console.log('Error:', err.message);
        }

        // 2. Connect to target DB and apply schema
        console.log(`Connecting to ${process.env.DB_NAME}...`);
        const pool = new Client({ ...dbConfig, database: process.env.DB_NAME });
        await pool.connect();

        const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await pool.query(schemaSql);
        console.log('Schema applied successfully.');

        await pool.end();
    } catch (err) {
        console.error('Error setting up database:', err);
    }
}

setupDatabase();
