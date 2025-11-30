const pool = require('./db');

async function checkUsers() {
    try {
        const res = await pool.query("SELECT id, name, email, role FROM users");
        console.log('Users found:', res.rows);
    } catch (err) {
        console.error('Error querying users:', err);
    } finally {
        pool.end();
    }
}

checkUsers();
