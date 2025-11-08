const Room = require('../models/Room');
const RoomType = require('../models/RoomType');
const { Op } = require('sequelize');

exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll({
            include: [{
                model: RoomType,
                attributes: ['name', 'base_price']
            }]
        });
        res.json({
            status: 'success',
            data: { rooms }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener las habitaciones',
            error: error.message
        });
    }
};

exports.getAvailableRooms = async (req, res) => {
    try {
        const { checkIn, checkOut } = req.query;
        
        // Validar fechas
        if (!checkIn || !checkOut) {
            return res.status(400).json({
                status: 'error',
                message: 'Las fechas de check-in y check-out son requeridas'
            });
        }

        // Obtener habitaciones disponibles
        const rooms = await Room.findAll({
            where: {
                status: 'available'
            },
            include: [{
                model: RoomType,
                attributes: ['name', 'base_price']
            }]
        });

        res.json({
            status: 'success',
            data: { rooms }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener las habitaciones disponibles',
            error: error.message
        });
    }
};

exports.getRoom = async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id, {
            include: [{
                model: RoomType,
                attributes: ['name', 'base_price']
            }]
        });
        
        if (!room) {
            return res.status(404).json({
                status: 'error',
                message: 'Habitación no encontrada'
            });
        }

        res.json({
            status: 'success',
            data: { room }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener la habitación',
            error: error.message
        });
    }
};

exports.createRoom = async (req, res) => {
    try {
        const room = await Room.create(req.body);
        
        const roomWithType = await Room.findByPk(room.id, {
            include: [{
                model: RoomType,
                attributes: ['name', 'base_price']
            }]
        });

        res.status(201).json({
            status: 'success',
            data: { room: roomWithType }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al crear la habitación',
            error: error.message
        });
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (!room) {
            return res.status(404).json({
                status: 'error',
                message: 'Habitación no encontrada'
            });
        }

        await room.update(req.body);
        
        const updatedRoom = await Room.findByPk(room.id, {
            include: [{
                model: RoomType,
                attributes: ['name', 'base_price']
            }]
        });

        res.json({
            status: 'success',
            data: { room: updatedRoom }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar la habitación',
            error: error.message
        });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (!room) {
            return res.status(404).json({
                status: 'error',
                message: 'Habitación no encontrada'
            });
        }

        await room.destroy();
        res.json({
            status: 'success',
            message: 'Habitación eliminada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar la habitación',
            error: error.message
        });
    }
};