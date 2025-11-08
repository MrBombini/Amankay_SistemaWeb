const express = require('express');
const router = express.Router();
const roomTypeController = require('../controllers/roomTypeController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

// Rutas públicas
router.get('/', roomTypeController.getAllRoomTypes);
router.get('/:id', roomTypeController.getRoomType);

// Rutas protegidas (solo admin)
router.post('/', authenticateToken, isAdmin, roomTypeController.createRoomType);
router.put('/:id', authenticateToken, isAdmin, roomTypeController.updateRoomType);
router.delete('/:id', authenticateToken, isAdmin, roomTypeController.deleteRoomType);

module.exports = router;