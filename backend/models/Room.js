const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const RoomType = require('./RoomType');

const Room = sequelize.define('Room', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    room_number: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.ENUM('available', 'occupied', 'maintenance'),
        defaultValue: 'available'
    },
    description: {
        type: DataTypes.TEXT
    },
    image_url: {
        type: DataTypes.STRING(255)
    }
}, {
    timestamps: true
});

// Relación con RoomType
Room.belongsTo(RoomType, {
    foreignKey: {
        name: 'room_type_id',
        allowNull: false
    }
});

module.exports = Room;