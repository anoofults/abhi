const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, requestController.createRequest);
router.get('/my-requests', verifyToken, requestController.getUserRequests);
router.get('/all', [verifyToken, isAdmin], requestController.getAllRequests);
router.put('/:id/status', [verifyToken, isAdmin], requestController.updateRequestStatus);

module.exports = router;
