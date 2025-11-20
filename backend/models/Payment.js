const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Booking = require('./Booking');

const Payment = sequelize.define('pago', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'monto'
    },
    payment_date: {
        type: DataTypes.DATE,
        field: 'fecha_pago'
    },
    payment_method: {
        type: DataTypes.ENUM('tarjeta_credito', 'tarjeta_debito', 'efectivo', 'transferencia'),
        allowNull: false,
        field: 'metodo_pago'
    },
    transaction_id: {
        type: DataTypes.STRING(100),
        field: 'numero_transaccion'
    },
    status: {
        type: DataTypes.ENUM('pendiente', 'completado', 'fallido', 'reembolsado'),
        defaultValue: 'pendiente',
        field: 'estado'
    }
}, {
    tableName: 'pagos',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true
});

// Relación con Booking
Payment.belongsTo(Booking, {
    foreignKey: {
        name: 'booking_id',
        field: 'id_reserva',
        allowNull: false
    }
});

module.exports = Payment;