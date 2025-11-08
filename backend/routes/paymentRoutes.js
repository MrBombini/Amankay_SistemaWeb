const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas para todos los usuarios
router.post('/', paymentController.createPayment);
router.get('/booking/:booking_id', paymentController.getBookingPayments);

// Rutas solo para admin
router.post('/:payment_id/refund', isAdmin, paymentController.refundPayment);

module.exports = router;