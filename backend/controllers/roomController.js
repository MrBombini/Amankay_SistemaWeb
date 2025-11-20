const sequelize = require('../config/database');

exports.getAllRooms = async (req, res) => {
    try {
        // Usar raw query para obtener directamente de la BD
        const [rooms] = await sequelize.query('SELECT * FROM habitaciones');
        console.log('✅ Habitaciones obtenidas:', rooms.length, 'registros');
        
        res.json({
            status: 'success',
            data: { rooms }
        });
    } catch (error) {
        console.error('❌ Error en getAllRooms:', error.message);
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
        
        if (!checkIn || !checkOut) {
            return res.status(400).json({
                status: 'error',
                message: 'Las fechas de check-in y check-out son requeridas'
            });
        }

        const [rooms] = await sequelize.query(
            'SELECT * FROM habitaciones WHERE estado = ?',
            { replacements: ['disponible'] }
        );

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
        const [rooms] = await sequelize.query(
            'SELECT * FROM habitaciones WHERE id = ?',
            { replacements: [req.params.id] }
        );
        
        if (!rooms || rooms.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Habitación no encontrada'
            });
        }

        res.json({
            status: 'success',
            data: { room: rooms[0] }
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
        const { numero, tipo, precio, estado, descripcion, imagen } = req.body;
        
        await sequelize.query(
            'INSERT INTO habitaciones (numero, tipo, precio, estado, descripcion, imagen) VALUES (?, ?, ?, ?, ?, ?)',
            { replacements: [numero, tipo, precio, estado || 'disponible', descripcion, imagen] }
        );

        res.status(201).json({
            status: 'success',
            message: 'Habitación creada exitosamente'
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
        const { numero, tipo, precio, estado, descripcion, imagen } = req.body;
        
        await sequelize.query(
            'UPDATE habitaciones SET numero=?, tipo=?, precio=?, estado=?, descripcion=?, imagen=? WHERE id=?',
            { replacements: [numero, tipo, precio, estado, descripcion, imagen, req.params.id] }
        );

        res.json({
            status: 'success',
            message: 'Habitación actualizada exitosamente'
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
        await sequelize.query(
            'DELETE FROM habitaciones WHERE id = ?',
            { replacements: [req.params.id] }
        );

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