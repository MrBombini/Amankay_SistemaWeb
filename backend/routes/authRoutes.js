const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, validateRegister } = require('../middlewares/auth');

// Rutas públicas
router.post('/register', validateRegister, authController.register);
router.post('/login', authController.login);

// Rutas protegidas
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;