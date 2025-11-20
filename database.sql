-- ============================================
-- HOTEL AMANKAY INN - BASE DE DATOS COMPLETA
-- ============================================

-- Eliminar base de datos si existe
DROP DATABASE IF EXISTS hotel_amankay;

-- Crear la base de datos
CREATE DATABASE hotel_amankay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hotel_amankay;

-- ============================================
-- TABLA DE USUARIOS
-- ============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
);

-- ============================================
-- TABLA DE HABITACIONES
-- ============================================
CREATE TABLE habitaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero VARCHAR(10) NOT NULL UNIQUE,
    tipo VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'disponible',
    descripcion TEXT,
    imagen VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_habitaciones_estado (estado),
    INDEX idx_habitaciones_tipo (tipo)
);

-- ============================================
-- TABLA DE RESERVAS
-- ============================================
CREATE TABLE reservas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_habitacion INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    total_price DECIMAL(10,2),
    special_requests TEXT,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (id_habitacion) REFERENCES habitaciones(id) ON DELETE RESTRICT,
    INDEX idx_reservas_usuario (id_usuario),
    INDEX idx_reservas_habitacion (id_habitacion),
    INDEX idx_reservas_fechas (fecha_inicio, fecha_fin),
    INDEX idx_reservas_estado (estado)
);

-- ============================================
-- TABLA DE PAGOS
-- ============================================
CREATE TABLE pagos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_reserva INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('tarjeta_credito', 'tarjeta_debito', 'efectivo', 'transferencia') DEFAULT 'efectivo',
    numero_transaccion VARCHAR(100),
    fecha_pago DATE,
    estado ENUM('pendiente', 'completado', 'fallido', 'reembolsado') DEFAULT 'pendiente',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_reserva) REFERENCES reservas(id) ON DELETE CASCADE,
    INDEX idx_pagos_reserva (id_reserva),
    INDEX idx_pagos_estado (estado)
);

-- ============================================
-- INSERTAR DATOS DE PRUEBA - USUARIOS
-- ============================================
-- Contraseña para todos: password123 (hasheada con bcrypt)
INSERT INTO users (name, email, password, role) VALUES
('Admin Amankay', 'admin@amankay.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tzO', 'admin'),
('Juan Cliente', 'juan@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tzO', 'client'),
('María García', 'maria@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/tzO', 'client');

-- ============================================
-- INSERTAR DATOS DE PRUEBA - HABITACIONES
-- ============================================
-- HABITACIONES INDIVIDUALES (Precio: $100/noche)
INSERT INTO habitaciones (numero, tipo, precio, estado, descripcion) VALUES
('101', 'Individual', 100.00, 'disponible', 'Habitación individual con vista al jardín, cama queen size, aire acondicionado'),
('102', 'Individual', 100.00, 'disponible', 'Habitación individual estándar con escritorio y minibar'),
('103', 'Individual', 100.00, 'disponible', 'Habitación individual con balcón privado y TV 42 pulgadas'),
('104', 'Individual', 100.00, 'disponible', 'Habitación individual con zona de trabajo completa');

-- HABITACIONES DOBLES (Precio: $150/noche)
INSERT INTO habitaciones (numero, tipo, precio, estado, descripcion) VALUES
('201', 'Doble', 150.00, 'disponible', 'Habitación doble con balcón y vista a la ciudad, dos camas individuales'),
('202', 'Doble', 150.00, 'disponible', 'Habitación doble con vista panorámica, sala de estar separada'),
('203', 'Doble', 150.00, 'disponible', 'Habitación doble superior con jacuzzi privado'),
('204', 'Doble', 150.00, 'disponible', 'Habitación doble con minibar premium y nevera');

-- HABITACIONES MATRIMONIALES (Precio: $180/noche)
INSERT INTO habitaciones (numero, tipo, precio, estado, descripcion) VALUES
('301', 'Matrimonial', 180.00, 'disponible', 'Habitación matrimonial con jacuzzi y vista al jardín'),
('302', 'Matrimonial', 180.00, 'disponible', 'Habitación matrimonial con vista panorámica y balcón grande'),
('303', 'Matrimonial', 180.00, 'disponible', 'Habitación matrimonial estándar con cama king size'),
('304', 'Matrimonial', 180.00, 'disponible', 'Habitación matrimonial con terraza privada y sala de estar');

-- SUITES (Precio: $300/noche)
INSERT INTO habitaciones (numero, tipo, precio, estado, descripcion) VALUES
('401', 'Suite', 300.00, 'disponible', 'Suite presidencial con terraza grande, jacuzzi y vista de la ciudad'),
('402', 'Suite', 300.00, 'disponible', 'Suite de lujo con dos dormitorios, sala y jacuzzi privado'),
('403', 'Suite', 300.00, 'disponible', 'Suite ejecutiva con sala de estar, minibar premium y vista panorámica');

-- ============================================
-- INSERTAR DATOS DE PRUEBA - RESERVAS (Opcional)
-- ============================================
-- Descomentar si deseas datos de prueba
-- INSERT INTO reservas (id_usuario, id_habitacion, fecha_inicio, fecha_fin, total_price, special_requests, estado) VALUES
-- (2, 1, '2025-11-25', '2025-11-27', 200.00, 'Solicito cama extra', 'confirmada'),
-- (3, 5, '2025-11-26', '2025-11-28', 300.00, 'Aniversario, sorpresa especial', 'confirmada');

-- ============================================
-- INSERCIONES DE PAGOS (Opcional)
-- ============================================
-- INSERT INTO pagos (id_reserva, monto, metodo_pago, numero_transaccion, fecha_pago, estado) VALUES
-- (1, 200.00, 'efectivo', 'TXN-001-2025', '2025-11-25', 'completado'),
-- (2, 300.00, 'efectivo', 'TXN-002-2025', '2025-11-26', 'completado');

-- ============================================
-- CONFIRMACIÓN Y ESTADÍSTICAS
-- ============================================
SELECT '✅ BASE DE DATOS CREADA EXITOSAMENTE!' AS mensaje;
SELECT CONCAT('📊 Total de Usuarios: ', COUNT(*)) AS estadistica FROM users;
SELECT CONCAT('🏨 Total de Habitaciones: ', COUNT(*)) AS estadistica FROM habitaciones;
SELECT CONCAT('💰 Precio Mínimo (Individual): $100/noche') AS info;
SELECT CONCAT('💰 Precio Máximo (Suite): $300/noche') AS info;