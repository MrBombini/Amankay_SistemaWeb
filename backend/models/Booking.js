const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Room = require('./Room');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    check_in_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    check_out_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
        defaultValue: 'pending'
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    special_requests: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true
});

// Relaciones
Booking.belongsTo(User, {
    foreignKey: {
        name: 'user_id',
        allowNull: false
    }
});

Booking.belongsTo(Room, {
    foreignKey: {
        name: 'room_id',
        allowNull: false
    }
});

module.exports = Booking;