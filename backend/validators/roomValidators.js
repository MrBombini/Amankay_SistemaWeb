const { body, param, query } = require('express-validator');
const { validateResult } = require('./validateHelper');

const validateRoom = [
    body('numero')
        .notEmpty()
        .withMessage('El número de habitación es requerido')
        .isString()
        .withMessage('El número de habitación debe ser texto'),
    body('tipo')
        .notEmpty()
        .withMessage('El tipo de habitación es requerido')
        .isString()
        .withMessage('El tipo de habitación debe ser texto'),
    body('precio')
        .notEmpty()
        .withMessage('El precio es requerido')
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número positivo'),
    body('estado')
        .optional()
        .isIn(['disponible', 'ocupada', 'mantenimiento'])
        .withMessage('Estado inválido'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

const validateRoomType = [
    // DEPRECATED: RoomType is no longer used in the new database structure
    // Room types are now stored directly in the habitaciones table as 'tipo' field
];

module.exports = {
    validateRoom,
    validateRoomType
};