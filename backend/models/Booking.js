const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Room = require('./Room');

const Booking = sequelize.define('reserva', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    check_in_date: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'fecha_inicio'
    },
    check_out_date: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'fecha_fin'
    },
    status: {
        type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada', 'completada'),
        defaultValue: 'pendiente',
        field: 'estado'
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'total_price'
    },
    special_requests: {
        type: DataTypes.TEXT,
        field: 'special_requests'
    }
}, {
    tableName: 'reservas',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true
});

// Relaciones
Booking.belongsTo(User, {
    foreignKey: {
        name: 'user_id',
        field: 'id_usuario',
        allowNull: false
    }
});

Booking.belongsTo(Room, {
    foreignKey: {
        name: 'room_id',
        field: 'id_habitacion',
        allowNull: false
    }
});

module.exports = Booking;