const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', inventoryController.getInventory);
router.put('/', [verifyToken, isAdmin], inventoryController.updateInventory);

module.exports = router;
