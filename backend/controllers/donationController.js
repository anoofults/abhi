const pool = require('../db');

exports.recordDonation = async (req, res) => {
    const { donor_email, blood_type, units } = req.body;

    try {
        // Find donor by email
        const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [donor_email]);
        if (userRes.rows.length === 0) {
            return res.status(404).json({ message: 'Donor not found.' });
        }
        const donorId = userRes.rows[0].id;

        // Record donation
        await pool.query(
            'INSERT INTO donations (donor_id, blood_type, units) VALUES ($1, $2, $3)',
            [donorId, blood_type, units]
        );

        // Update inventory
        await pool.query(
            'UPDATE blood_inventory SET units_available = units_available + $1 WHERE blood_type = $2',
            [units, blood_type]
        );

        res.status(201).json({ message: 'Donation recorded successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error recording donation.' });
    }
};

exports.getMyDonations = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM donations WHERE donor_id = $1 ORDER BY donation_date DESC',
            [req.userId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching donations.' });
    }
};
