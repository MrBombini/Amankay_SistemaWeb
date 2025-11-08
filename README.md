# Hotel Amankay Inn - Backend

Backend del Sistema de Reservas del Hotel Amankay Inn desarrollado con Node.js, Express y MySQL.

## 🛠️ Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm o yarn

## 📦 Instalación

1. Clonar el repositorio:
```bash
git clone <repositorio>
cd hotel-amankay/backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```
Editar el archivo `.env` con tus configuraciones.

4. Crear la base de datos:
- Importar el archivo `database.sql` en tu servidor MySQL

5. Iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

## 📚 Estructura del Proyecto

```
/backend
├── config/         # Configuraciones (DB, etc)
├── controllers/    # Controladores
├── middlewares/   # Middlewares personalizados
├── models/        # Modelos Sequelize
├── routes/        # Rutas de la API
├── utils/         # Utilidades y helpers
├── .env.example   # Ejemplo de variables de entorno
├── server.js      # Punto de entrada
└── package.json   # Dependencias y scripts
```

## 🔑 Endpoints Principales

### Autenticación
- POST /api/auth/register - Registro de usuario
- POST /api/auth/login - Inicio de sesión

### Habitaciones
- GET /api/rooms - Listar habitaciones
- POST /api/rooms - Crear habitación (Admin)
- PUT /api/rooms/:id - Actualizar habitación (Admin)
- DELETE /api/rooms/:id - Eliminar habitación (Admin)

### Reservas
- GET /api/bookings - Listar reservas
- POST /api/bookings - Crear reserva
- PUT /api/bookings/:id - Actualizar reserva
- DELETE /api/bookings/:id - Cancelar reserva

### Reportes (Admin)
- GET /api/reports/occupancy - Reporte de ocupación
- GET /api/reports/bookings - Reporte de reservas

## 🔐 Autenticación

El sistema utiliza JWT para la autenticación. Para endpoints protegidos, incluir el token en el header:

```
Authorization: Bearer <token>
```

## 📝 Scripts Disponibles

- `npm start`: Inicia el servidor en modo producción
- `npm run dev`: Inicia el servidor en modo desarrollo con nodemon

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

# Hotel Amankay Inn - Frontend

Frontend del Sistema de Reservas del Hotel Amankay Inn desarrollado con React + Vite + TailwindCSS.

## 🛠️ Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn

## 📦 Instalación

1. Clonar el repositorio:
```bash
git clone <repositorio>
cd hotel-amankay/frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```
Editar el archivo `.env` con tus configuraciones.

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📚 Estructura del Proyecto

```
/frontend
├── src/
│   ├── components/    # Componentes reutilizables
│   ├── pages/        # Páginas de la aplicación
│   ├── services/     # Servicios de API
│   ├── context/      # Contextos de React
│   ├── App.jsx       # Componente principal
│   └── main.jsx      # Punto de entrada
├── public/           # Archivos estáticos
├── .env.example      # Ejemplo de variables de entorno
└── package.json      # Dependencias y scripts
```

## 📱 Páginas Principales

- `/` - Inicio (listado de habitaciones)
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/reservas` - Reservas del usuario
- `/admin/habitaciones` - Gestión de habitaciones (admin)
- `/admin/reservas` - Gestión de reservas (admin)
- `/admin/reportes` - Reportes y estadísticas (admin)

## 📝 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la versión de producción

## 🔐 Autenticación

La autenticación se maneja mediante JWT almacenado en localStorage. Las rutas protegidas verifican la presencia y validez del token.

## 🎨 Estilos

El proyecto utiliza TailwindCSS para los estilos. La configuración se encuentra en:
- `tailwind.config.js`
- `src/index.css`

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request