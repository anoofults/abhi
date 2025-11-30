const pool = require('../db');

exports.getProfile = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, phone, blood_type FROM users WHERE id = $1', [req.userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching profile.' });
    }
};

exports.getUserCount = async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM users');
        res.status(200).json({ count: parseInt(result.rows[0].count) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching user count.' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, phone, blood_type, created_at FROM users ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching all users.' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error deleting user.' });
    }
};
