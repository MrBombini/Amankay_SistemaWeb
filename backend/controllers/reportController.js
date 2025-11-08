const { sequelize } = require('../models/Booking');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Payment = require('../models/Payment');
const { Op } = require('sequelize');

exports.getOccupancyReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const occupancyData = await Room.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status']
        });

        const bookingsData = await Booking.findAll({
            where: {
                check_in_date: {
                    [Op.between]: [startDate, endDate]
                }
            },
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status']
        });

        res.json({
            status: 'success',
            data: {
                occupancy: occupancyData,
                bookings: bookingsData
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al generar reporte de ocupación',
            error: error.message
        });
    }
};

exports.getRevenueReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const revenueData = await Payment.findAll({
            where: {
                payment_date: {
                    [Op.between]: [startDate, endDate]
                },
                status: 'completed'
            },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('payment_date')), 'date'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'total_revenue'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'total_payments']
            ],
            group: [sequelize.fn('DATE', sequelize.col('payment_date'))]
        });

        const totalRevenue = await Payment.sum('amount', {
            where: {
                payment_date: {
                    [Op.between]: [startDate, endDate]
                },
                status: 'completed'
            }
        });

        res.json({
            status: 'success',
            data: {
                revenue: revenueData,
                total: totalRevenue
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al generar reporte de ingresos',
            error: error.message
        });
    }
};

exports.getCancellationReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const cancellationData = await Booking.findAll({
            where: {
                status: 'cancelled',
                updatedAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('updatedAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'cancellations']
            ],
            group: [sequelize.fn('DATE', sequelize.col('updatedAt'))]
        });

        const totalCancellations = await Booking.count({
            where: {
                status: 'cancelled',
                updatedAt: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        const cancellationRate = await sequelize.query(`
            SELECT 
                (COUNT(CASE WHEN status = 'cancelled' THEN 1 END) * 100.0 / COUNT(*)) as cancellation_rate
            FROM bookings
            WHERE updatedAt BETWEEN :startDate AND :endDate
        `, {
            replacements: { startDate, endDate },
            type: sequelize.QueryTypes.SELECT
        });

        res.json({
            status: 'success',
            data: {
                daily: cancellationData,
                total: totalCancellations,
                rate: cancellationRate[0].cancellation_rate
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al generar reporte de cancelaciones',
            error: error.message
        });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        // Estadísticas generales
        const totalRooms = await Room.count();
        const occupiedRooms = await Room.count({ where: { status: 'occupied' } });
        const activeBookings = await Booking.count({ 
            where: { 
                status: 'confirmed',
                check_out_date: {
                    [Op.gte]: new Date()
                }
            } 
        });

        // Ingresos del mes actual
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyRevenue = await Payment.sum('amount', {
            where: {
                status: 'completed',
                payment_date: {
                    [Op.gte]: startOfMonth
                }
            }
        });

        // Próximas llegadas/salidas
        const upcomingArrivals = await Booking.findAll({
            where: {
                status: 'confirmed',
                check_in_date: {
                    [Op.between]: [new Date(), new Date(Date.now() + 24 * 60 * 60 * 1000)]
                }
            },
            include: [
                {
                    model: Room,
                    attributes: ['room_number']
                }
            ],
            limit: 5
        });

        res.json({
            status: 'success',
            data: {
                occupancy: {
                    total: totalRooms,
                    occupied: occupiedRooms,
                    occupancyRate: (occupiedRooms / totalRooms) * 100
                },
                bookings: {
                    active: activeBookings,
                    upcomingArrivals
                },
                revenue: {
                    monthly: monthlyRevenue || 0
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener estadísticas del dashboard',
            error: error.message
        });
    }
};