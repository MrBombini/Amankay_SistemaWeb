const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoomType = sequelize.define('RoomType', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = RoomType;