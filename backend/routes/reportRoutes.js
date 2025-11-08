const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

// Todas las rutas requieren autenticación y rol de admin
router.use(authenticateToken, isAdmin);

router.get('/occupancy', reportController.getOccupancyReport);
router.get('/revenue', reportController.getRevenueReport);
router.get('/cancellations', reportController.getCancellationReport);
router.get('/dashboard', reportController.getDashboardStats);

module.exports = router;