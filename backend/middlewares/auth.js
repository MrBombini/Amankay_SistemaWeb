const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar el token JWT
exports.authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'No se proporcionó token de acceso'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Token inválido o expirado'
        });
    }
};

// Middleware para verificar rol de administrador
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            status: 'error',
            message: 'Acceso denegado: se requieren privilegios de administrador'
        });
    }
};

// Middleware para validar datos de registro
exports.validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Todos los campos son requeridos'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            status: 'error',
            message: 'La contraseña debe tener al menos 6 caracteres'
        });
    }

    next();
};