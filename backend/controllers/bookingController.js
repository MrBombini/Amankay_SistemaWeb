const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                {
                    model: Room,
                    attributes: ['room_number', 'status']
                },
                {
                    model: User,
                    attributes: ['name', 'email']
                }
            ]
        });
        res.json({
            status: 'success',
            data: { bookings }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener las reservas',
            error: error.message
        });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { user_id: req.user.id },
            include: [
                {
                    model: Room,
                    attributes: ['room_number', 'status']
                }
            ]
        });
        res.json({
            status: 'success',
            data: { bookings }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener las reservas del usuario',
            error: error.message
        });
    }
};

exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id, {
            include: [
                {
                    model: Room,
                    attributes: ['room_number', 'status']
                },
                {
                    model: User,
                    attributes: ['name', 'email']
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Reserva no encontrada'
            });
        }

        // Verificar que el usuario sea el dueño de la reserva o un admin
        if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'No tienes permiso para ver esta reserva'
            });
        }

        res.json({
            status: 'success',
            data: { booking }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener la reserva',
            error: error.message
        });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { room_id, check_in_date, check_out_date, special_requests } = req.body;

        // Verificar disponibilidad de la habitación
        const existingBooking = await Booking.findOne({
            where: {
                room_id,
                status: {
                    [Op.notIn]: ['cancelled']
                },
                [Op.or]: [
                    {
                        check_in_date: {
                            [Op.between]: [check_in_date, check_out_date]
                        }
                    },
                    {
                        check_out_date: {
                            [Op.between]: [check_in_date, check_out_date]
                        }
                    }
                ]
            }
        });

        if (existingBooking) {
            return res.status(400).json({
                status: 'error',
                message: 'La habitación no está disponible para las fechas seleccionadas'
            });
        }

        // Obtener el precio de la habitación
        const room = await Room.findByPk(room_id, {
            include: [{ model: RoomType }]
        });

        if (!room) {
            return res.status(404).json({
                status: 'error',
                message: 'Habitación no encontrada'
            });
        }

        // Calcular el precio total
        const days = Math.ceil((new Date(check_out_date) - new Date(check_in_date)) / (1000 * 60 * 60 * 24));
        const total_price = room.RoomType.base_price * days;

        // Crear la reserva
        const booking = await Booking.create({
            user_id: req.user.id,
            room_id,
            check_in_date,
            check_out_date,
            total_price,
            special_requests,
            status: 'pending'
        });

        const bookingWithDetails = await Booking.findByPk(booking.id, {
            include: [
                {
                    model: Room,
                    attributes: ['room_number', 'status']
                },
                {
                    model: User,
                    attributes: ['name', 'email']
                }
            ]
        });

        res.status(201).json({
            status: 'success',
            data: { booking: bookingWithDetails }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al crear la reserva',
            error: error.message
        });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        
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
                message: 'No tienes permiso para modificar esta reserva'
            });
        }

        await booking.update(req.body);

        const updatedBooking = await Booking.findByPk(booking.id, {
            include: [
                {
                    model: Room,
                    attributes: ['room_number', 'status']
                },
                {
                    model: User,
                    attributes: ['name', 'email']
                }
            ]
        });

        res.json({
            status: 'success',
            data: { booking: updatedBooking }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar la reserva',
            error: error.message
        });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        
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
                message: 'No tienes permiso para cancelar esta reserva'
            });
        }

        await booking.update({ status: 'cancelled' });

        res.json({
            status: 'success',
            message: 'Reserva cancelada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al cancelar la reserva',
            error: error.message
        });
    }
};