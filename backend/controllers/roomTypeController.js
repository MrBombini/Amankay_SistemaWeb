const RoomType = require('../models/RoomType');

exports.getAllRoomTypes = async (req, res) => {
    try {
        const roomTypes = await RoomType.findAll();
        res.json({
            status: 'success',
            data: { roomTypes }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener los tipos de habitación',
            error: error.message
        });
    }
};

exports.getRoomType = async (req, res) => {
    try {
        const roomType = await RoomType.findByPk(req.params.id);
        if (!roomType) {
            return res.status(404).json({
                status: 'error',
                message: 'Tipo de habitación no encontrado'
            });
        }
        res.json({
            status: 'success',
            data: { roomType }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener el tipo de habitación',
            error: error.message
        });
    }
};

exports.createRoomType = async (req, res) => {
    try {
        const roomType = await RoomType.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { roomType }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al crear el tipo de habitación',
            error: error.message
        });
    }
};

exports.updateRoomType = async (req, res) => {
    try {
        const roomType = await RoomType.findByPk(req.params.id);
        if (!roomType) {
            return res.status(404).json({
                status: 'error',
                message: 'Tipo de habitación no encontrado'
            });
        }

        await roomType.update(req.body);
        res.json({
            status: 'success',
            data: { roomType }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar el tipo de habitación',
            error: error.message
        });
    }
};

exports.deleteRoomType = async (req, res) => {
    try {
        const roomType = await RoomType.findByPk(req.params.id);
        if (!roomType) {
            return res.status(404).json({
                status: 'error',
                message: 'Tipo de habitación no encontrado'
            });
        }

        await roomType.destroy();
        res.json({
            status: 'success',
            message: 'Tipo de habitación eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar el tipo de habitación',
            error: error.message
        });
    }
};