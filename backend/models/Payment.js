const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Booking = require('./Booking');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    payment_method: {
        type: DataTypes.ENUM('credit_card', 'debit_card', 'cash', 'transfer'),
        allowNull: false
    },
    transaction_id: {
        type: DataTypes.STRING(100)
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true
});

// Relación con Booking
Payment.belongsTo(Booking, {
    foreignKey: {
        name: 'booking_id',
        allowNull: false
    }
});

module.exports = Payment;