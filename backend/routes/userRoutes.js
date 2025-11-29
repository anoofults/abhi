const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/profile', verifyToken, userController.getProfile);
router.get('/count', [verifyToken, isAdmin], userController.getUserCount);
router.get('/all', [verifyToken, isAdmin], userController.getAllUsers);

module.exports = router;
