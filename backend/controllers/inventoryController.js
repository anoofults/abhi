const pool = require('../db');

exports.getInventory = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blood_inventory ORDER BY blood_type ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching inventory.' });
    }
};

exports.updateInventory = async (req, res) => {
    const { blood_type, units } = req.body;

    try {
        // Check if blood type exists
        const check = await pool.query('SELECT * FROM blood_inventory WHERE blood_type = $1', [blood_type]);

        if (check.rows.length === 0) {
            // Insert if not exists (though schema seeds it, good for safety)
            await pool.query('INSERT INTO blood_inventory (blood_type, units_available) VALUES ($1, $2)', [blood_type, units]);
        } else {
            // Update
            await pool.query('UPDATE blood_inventory SET units_available = $1 WHERE blood_type = $2', [units, blood_type]);
        }

        const updated = await pool.query('SELECT * FROM blood_inventory WHERE blood_type = $1', [blood_type]);
        res.status(200).json(updated.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating inventory.' });
    }
};
