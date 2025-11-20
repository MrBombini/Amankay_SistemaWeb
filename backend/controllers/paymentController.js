const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

exports.createPayment = async (req, res) => {
    try {
        const { booking_id, amount, payment_method, transaction_id } = req.body;

        // Verificar que la reserva existe
        const booking = await Booking.findByPk(booking_id);
        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Reserva no encontrada'
            });
        }

        // Verificar que el usuario es el dueño de la reserva o un admin
        if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'No tienes permiso para realizar este pago'
            });
        }

        // Crear el pago
        const payment = await Payment.create({
            booking_id,
            amount,
            payment_method,
            transaction_id,
            status: 'completado'
        });

        // Actualizar el estado de la reserva
        await booking.update({ status: 'confirmada' });

        res.status(201).json({
            status: 'success',
            data: { payment }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al procesar el pago',
            error: error.message
        });
    }
};

exports.getBookingPayments = async (req, res) => {
    try {
        const { booking_id } = req.params;

        // Verificar que la reserva existe
        const booking = await Booking.findByPk(booking_id);
        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Reserva no encontrada'
            });
        }

        // Verificar permisos
        if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'No tienes permiso para ver estos pagos'
            });
        }

        // Obtener pagos
        const payments = await Payment.findAll({
            where: { booking_id }
        });

        res.json({
            status: 'success',
            data: { payments }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener los pagos',
            error: error.message
        });
    }
};

exports.refundPayment = async (req, res) => {
    try {
        const { payment_id } = req.params;

        const payment = await Payment.findByPk(payment_id, {
            include: [Booking]
        });

        if (!payment) {
            return res.status(404).json({
                status: 'error',
                message: 'Pago no encontrado'
            });
        }

        // Solo admin puede realizar reembolsos
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Solo los administradores pueden procesar reembolsos'
            });
        }

        // Actualizar estado del pago
        await payment.update({ status: 'refunded' });

        // Actualizar estado de la reserva
        await payment.Booking.update({ status: 'cancelled' });

        res.json({
            status: 'success',
            message: 'Reembolso procesado correctamente',
            data: { payment }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al procesar el reembolso',
            error: error.message
        });
    }
};