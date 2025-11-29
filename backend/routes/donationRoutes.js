const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', [verifyToken, isAdmin], donationController.recordDonation);
router.get('/my-history', verifyToken, donationController.getMyDonations);

module.exports = router;
