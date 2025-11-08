const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generar token JWT
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Registro de usuario
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'El correo electrónico ya está registrado'
            });
        }

        // Crear nuevo usuario
        const user = await User.create({
            name,
            email,
            password
        });

        // Generar token
        const token = generateToken(user);

        res.status(201).json({
            status: 'success',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
};

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isValidPassword = await user.checkPassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                status: 'error',
                message: 'Credenciales inválidas'
            });
        }

        // Generar token
        const token = generateToken(user);

        res.json({
            status: 'success',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
};

// Obtener perfil de usuario
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        res.json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener perfil',
            error: error.message
        });
    }
};