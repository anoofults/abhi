const pool = require('../db');

exports.createRequest = async (req, res) => {
    const { blood_type } = req.body;
    const userId = req.userId;

    try {
        const result = await pool.query(
            'INSERT INTO donation_requests (user_id, blood_type, status) VALUES ($1, $2, $3) RETURNING *',
            [userId, blood_type, 'pending']
        );

        // Notify all donors
        const donors = await pool.query("SELECT id FROM users WHERE role = 'donor'");
        const notifications = donors.rows.map(donor => {
            return pool.query(
                'INSERT INTO notifications (user_id, message) VALUES ($1, $2)',
                [donor.id, `Urgent: Blood Request for ${blood_type} needed!`]
            );
        });
        await Promise.all(notifications);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating request.' });
    }
};

exports.getUserRequests = async (req, res) => {
    const userId = req.userId;

    try {
        const result = await pool.query(
            'SELECT * FROM donation_requests WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching requests.' });
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT r.*, u.name as user_name, u.email as user_email 
       FROM donation_requests r 
       JOIN users u ON r.user_id = u.id 
       ORDER BY r.created_at DESC`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching all requests.' });
    }
};

exports.updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'approved', 'declined', 'completed'

    try {
        const result = await pool.query(
            'UPDATE donation_requests SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating request status.' });
    }
};
