const { body, param } = require('express-validator');
const { validateResult } = require('./validateHelper');

const validateBooking = [
    body('room_id')
        .notEmpty()
        .withMessage('El ID de la habitación es requerido')
        .isInt()
        .withMessage('El ID de la habitación debe ser un número'),
    body('check_in_date')
        .notEmpty()
        .withMessage('La fecha de entrada es requerida')
        .isISO8601()
        .withMessage('Formato de fecha inválido'),
    body('check_out_date')
        .notEmpty()
        .withMessage('La fecha de salida es requerida')
        .isISO8601()
        .withMessage('Formato de fecha inválido')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.check_in_date)) {
                throw new Error('La fecha de salida debe ser posterior a la fecha de entrada');
            }
            return true;
        }),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

const validatePayment = [
    body('booking_id')
        .notEmpty()
        .withMessage('El ID de la reserva es requerido')
        .isInt()
        .withMessage('El ID de la reserva debe ser un número'),
    body('amount')
        .notEmpty()
        .withMessage('El monto es requerido')
        .isFloat({ min: 0 })
        .withMessage('El monto debe ser un número positivo'),
    body('payment_method')
        .notEmpty()
        .withMessage('El método de pago es requerido')
        .isIn(['credit_card', 'debit_card', 'cash', 'transfer'])
        .withMessage('Método de pago inválido'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

module.exports = {
    validateBooking,
    validatePayment
};