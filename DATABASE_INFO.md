# 🗄️ BASE DE DATOS - HOTEL AMANKAY INN

## 📋 Información General

**Archivo Principal:** `database.sql`

Esta es la **ÚNICA base de datos** que necesitas. Contiene:
- ✅ Estructura completa con todas las tablas
- ✅ Índices de optimización
- ✅ Datos de prueba (usuarios, habitaciones)
- ✅ Relaciones y constraints (FK, ON DELETE CASCADE)

---

## 🗃️ TABLAS DE LA BASE DE DATOS

### 1️⃣ TABLA: `users`
**Propósito:** Almacenar datos de usuarios (clientes y administradores)

```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR 100)
- email (VARCHAR 100, UNIQUE)
- password (VARCHAR 255) - Hasheada con bcrypt
- role (ENUM: 'client', 'admin')
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

**Índices:**
- `idx_users_email` - Para búsqueda rápida por email
- `idx_users_role` - Para filtrar por rol

---

### 2️⃣ TABLA: `habitaciones`
**Propósito:** Almacenar información de las habitaciones del hotel

```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- numero (VARCHAR 10, UNIQUE) - Ej: "101", "201", "301", "401"
- tipo (VARCHAR 50) - Individual, Doble, Matrimonial, Suite
- precio (DECIMAL 10,2) - Precio por noche
- estado (VARCHAR 50) - "disponible" o "no disponible"
- descripcion (TEXT) - Descripción detallada
- imagen (VARCHAR 255) - URL de la imagen
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

**Tipos de Habitaciones:**
- Individual: $100/noche
- Doble: $150/noche
- Matrimonial: $180/noche
- Suite: $300/noche

**Índices:**
- `idx_habitaciones_estado` - Para filtrar por estado
- `idx_habitaciones_tipo` - Para filtrar por tipo

---

### 3️⃣ TABLA: `reservas`
**Propósito:** Almacenar las reservas de los clientes

```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- id_usuario (INT, NOT NULL, FOREIGN KEY) → users.id
- id_habitacion (INT, NOT NULL, FOREIGN KEY) → habitaciones.id
- fecha_inicio (DATE, NOT NULL) - Fecha de check-in
- fecha_fin (DATE, NOT NULL) - Fecha de check-out
- total_price (DECIMAL 10,2) - Precio total de la reserva
- special_requests (TEXT) - Solicitudes especiales del cliente
- estado (ENUM) - 'pendiente', 'confirmada', 'cancelada', 'completada'
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

**Estados de Reserva:**
- `pendiente` - Reserva creada, no confirmada
- `confirmada` - Pago completado
- `cancelada` - Reserva cancelada
- `completada` - Estadía finalizada

**Índices:**
- `idx_reservas_usuario` - Obtener reservas de un usuario
- `idx_reservas_habitacion` - Obtener reservas de una habitación
- `idx_reservas_fechas` - Verificar disponibilidad
- `idx_reservas_estado` - Filtrar por estado

**Relaciones:**
- FK a `users`: ON DELETE CASCADE (si eliminas usuario, se eliminan sus reservas)
- FK a `habitaciones`: ON DELETE RESTRICT (no puedes eliminar una habitación con reservas)

---

### 4️⃣ TABLA: `pagos`
**Propósito:** Registrar los pagos de las reservas

```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- id_reserva (INT, NOT NULL, FOREIGN KEY) → reservas.id
- monto (DECIMAL 10,2, NOT NULL) - Cantidad pagada
- metodo_pago (ENUM) - 'tarjeta_credito', 'tarjeta_debito', 'efectivo', 'transferencia'
- numero_transaccion (VARCHAR 100) - ID de transacción (opcional)
- fecha_pago (DATE) - Fecha del pago
- estado (ENUM) - 'pendiente', 'completado', 'fallido', 'reembolsado'
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

**Estados de Pago:**
- `pendiente` - Pago no procesado
- `completado` - Pago exitoso
- `fallido` - Pago rechazado
- `reembolsado` - Pago devuelto

**Índices:**
- `idx_pagos_reserva` - Obtener pagos de una reserva
- `idx_pagos_estado` - Filtrar por estado

**Relaciones:**
- FK a `reservas`: ON DELETE CASCADE (si eliminas reserva, se eliminan sus pagos)

---

## 👥 USUARIOS DE PRUEBA

| Email | Contraseña | Rol | Nombre |
|-------|-----------|-----|--------|
| `admin@amankay.com` | `admin123` | Admin | Admin Amankay |
| `juan@example.com` | `admin123` | Cliente | Juan Cliente |
| `maria@example.com` | `admin123` | Cliente | María García |

**Nota:** Todas las contraseñas están hasheadas con bcrypt. La contraseña decodificada es `admin123` para todos.

---

## 🏨 HABITACIONES DISPONIBLES

### Individuales (4 habitaciones)
- 101: Individual con vista al jardín - $100/noche
- 102: Individual estándar - $100/noche
- 103: Individual con balcón - $100/noche
- 104: Individual con zona de trabajo - $100/noche

### Dobles (4 habitaciones)
- 201: Doble con balcón - $150/noche
- 202: Doble con vista a la ciudad - $150/noche
- 203: Doble superior con jacuzzi - $150/noche
- 204: Doble con minibar premium - $150/noche

### Matrimoniales (4 habitaciones)
- 301: Matrimonial con jacuzzi - $180/noche
- 302: Matrimonial con vista panorámica - $180/noche
- 303: Matrimonial estándar - $180/noche
- 304: Matrimonial con terraza - $180/noche

### Suites (3 habitaciones)
- 401: Suite presidencial - $300/noche
- 402: Suite de lujo - $300/noche
- 403: Suite ejecutiva - $300/noche

**Total: 15 habitaciones**

---

## 📊 DIAGRAMA DE RELACIONES

```
users (1) ─── (N) reservas (1) ─── (N) pagos
              │
              └─ (1) ─── (N) habitaciones
```

---

## 🚀 CÓMO USAR LA BASE DE DATOS

### Opción 1: Desde MySQL Workbench
1. Abre `database.sql`
2. Ejecuta el script completo
3. Selecciona la base de datos `hotel_amankay`

### Opción 2: Desde línea de comandos
```bash
mysql -h localhost -u root < database.sql
```

### Opción 3: Desde Laragon
1. Abre Laragon
2. Click derecho → "MySQL"
3. Ejecuta: `source database.sql;`

---

## ✅ VERIFICAR LA INSTALACIÓN

```sql
USE hotel_amankay;

-- Ver usuarios
SELECT * FROM users;

-- Ver habitaciones
SELECT * FROM habitaciones;

-- Ver estadísticas
SELECT COUNT(*) as total_usuarios FROM users;
SELECT COUNT(*) as total_habitaciones FROM habitaciones;
SELECT COUNT(*) as total_reservas FROM reservas;
SELECT COUNT(*) as total_pagos FROM pagos;
```

---

## 🔑 INFORMACIÓN IMPORTANTE

1. **No necesitas múltiples archivos** - Todo está en `database.sql`
2. **Las contraseñas están seguras** - Hasheadas con bcrypt (10 rondas)
3. **Los índices optimizan consultas** - Especialmente en reservas y disponibilidad
4. **Las relaciones están bien definidas** - Con ON DELETE CASCADE/RESTRICT
5. **Los datos de prueba están listos** - Puedes usarlos inmediatamente

---

**Creado para: Hotel Amankay Inn**  
**Última actualización: 20/11/2025**
