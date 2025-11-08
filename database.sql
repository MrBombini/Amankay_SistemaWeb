-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS hotel_amankay;
USE hotel_amankay;

-- Tabla de usuarios
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de tipos de habitación
CREATE TABLE room_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de habitaciones
CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_number VARCHAR(10) NOT NULL UNIQUE,
    room_type_id INT NOT NULL,
    status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
    description TEXT,
    image_url VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id)
);

-- Tabla de reservas
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    total_price DECIMAL(10,2) NOT NULL,
    special_requests TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Tabla de pagos
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('credit_card', 'debit_card', 'cash', 'transfer') NOT NULL,
    transaction_id VARCHAR(100),
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Datos de prueba: Tipos de habitación
INSERT INTO room_types (name, description, base_price) VALUES
('Individual', 'Habitación individual con una cama', 100.00),
('Doble', 'Habitación con dos camas individuales', 150.00),
('Matrimonial', 'Habitación con una cama matrimonial', 180.00),
('Suite', 'Suite de lujo con sala de estar', 300.00);

-- Datos de prueba: Habitaciones
INSERT INTO rooms (room_number, room_type_id, description) VALUES
('101', 1, 'Habitación individual con vista al jardín'),
('102', 1, 'Habitación individual estándar'),
('201', 2, 'Habitación doble con balcón'),
('202', 2, 'Habitación doble con vista a la ciudad'),
('301', 3, 'Habitación matrimonial con jacuzzi'),
('302', 3, 'Habitación matrimonial con vista panorámica'),
('401', 4, 'Suite presidencial con terraza');

-- Usuario administrador por defecto
-- Contraseña: admin123 (debe ser hasheada en la aplicación)
INSERT INTO users (name, email, password, role) VALUES
('Administrador', 'admin@hotelamankay.com', '$2b$10$YourHashedPasswordHere', 'admin');

-- Índices para optimización
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_users_email ON users(email);

-- Trigger para actualizar el estado de la habitación cuando se confirma una reserva
DELIMITER //
CREATE TRIGGER after_booking_confirmation
AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        UPDATE rooms SET status = 'occupied' WHERE id = NEW.room_id;
    END IF;
END //
DELIMITER ;