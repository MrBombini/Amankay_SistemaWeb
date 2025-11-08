require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Crear la aplicación Express
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const roomTypeRoutes = require('./routes/roomTypeRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Rutas base
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/room-types', roomTypeRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Puerto
const PORT = process.env.PORT || 3000;

// Función para encontrar un puerto disponible
async function findAvailablePort(startPort) {
    const net = require('net');
    
    function isPortAvailable(port) {
        return new Promise((resolve) => {
            const server = net.createServer();
            server.listen(port, () => {
                server.close();
                resolve(true);
            });
            server.on('error', () => {
                resolve(false);
            });
        });
    }

    let port = startPort;
    while (!(await isPortAvailable(port))) {
        port++;
    }
    return port;
}

// Iniciar servidor
async function startServer() {
    try {
        // Verificar conexión a la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');

        // Sincronizar modelos con la base de datos
        // En producción, usar { force: false }
        await sequelize.sync({ force: false });
        console.log('✅ Modelos sincronizados con la base de datos.');

        // Encontrar puerto disponible
        const availablePort = await findAvailablePort(PORT);
        
        // Iniciar servidor
        app.listen(availablePort, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${availablePort}`);
            if (availablePort !== PORT) {
                console.log(`ℹ️  Puerto ${PORT} estaba ocupado, usando puerto ${availablePort} en su lugar`);
            }
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();