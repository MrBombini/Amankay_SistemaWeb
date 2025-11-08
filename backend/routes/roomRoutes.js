const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');
const { validateRoom } = require('../validators/roomValidators');

// Rutas públicas
router.get('/', roomController.getAllRooms);
router.get('/available', roomController.getAvailableRooms);
router.get('/:id', roomController.getRoom);

// Rutas protegidas (solo admin)
router.post('/', authenticateToken, isAdmin, validateRoom, roomController.createRoom);
router.put('/:id', authenticateToken, isAdmin, validateRoom, roomController.updateRoom);
router.delete('/:id', authenticateToken, isAdmin, roomController.deleteRoom);

module.exports = router;