const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');
const { validateBooking } = require('../validators/bookingValidators');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas para todos los usuarios
router.get('/my-bookings', bookingController.getUserBookings);
router.post('/', validateBooking, bookingController.createBooking);
router.get('/:id', bookingController.getBooking);
router.put('/:id', validateBooking, bookingController.updateBooking);
router.patch('/:id/cancel', bookingController.cancelBooking);

// Rutas solo para admin
router.get('/', isAdmin, bookingController.getAllBookings);

module.exports = router;