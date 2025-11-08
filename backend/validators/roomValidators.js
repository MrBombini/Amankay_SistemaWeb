const { body, param, query } = require('express-validator');
const { validateResult } = require('./validateHelper');

const validateRoom = [
    body('room_number')
        .notEmpty()
        .withMessage('El número de habitación es requerido')
        .isString()
        .withMessage('El número de habitación debe ser texto'),
    body('room_type_id')
        .notEmpty()
        .withMessage('El tipo de habitación es requerido')
        .isInt()
        .withMessage('El tipo de habitación debe ser un número'),
    body('status')
        .optional()
        .isIn(['available', 'occupied', 'maintenance'])
        .withMessage('Estado inválido'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

const validateRoomType = [
    body('name')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isString()
        .withMessage('El nombre debe ser texto'),
    body('base_price')
        .notEmpty()
        .withMessage('El precio base es requerido')
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número positivo'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

module.exports = {
    validateRoom,
    validateRoomType
};