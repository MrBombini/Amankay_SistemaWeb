const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('habitacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    numero: {
        type: DataTypes.STRING(10),
        field: 'numero'
    },
    tipo: {
        type: DataTypes.STRING(50),
        field: 'tipo'
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'precio'
    },
    estado: {
        type: DataTypes.STRING(50),
        field: 'estado'
    },
    descripcion: {
        type: DataTypes.TEXT,
        field: 'descripcion'
    },
    imagen: {
        type: DataTypes.STRING(255),
        field: 'imagen'
    }
}, {
    tableName: 'habitaciones',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true
});

module.exports = Room;