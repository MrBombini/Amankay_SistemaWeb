const { body } = require('express-validator');
const { validateResult } = require('./validateHelper');

const validateLogin = [
    body('email')
        .notEmpty()
        .withMessage('El correo es requerido')
        .isEmail()
        .withMessage('Debe ser un correo válido'),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

const validateRegister = [
    body('name')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isString()
        .withMessage('El nombre debe ser texto'),
    body('email')
        .notEmpty()
        .withMessage('El correo es requerido')
        .isEmail()
        .withMessage('Debe ser un correo válido'),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

module.exports = {
    validateLogin,
    validateRegister
};