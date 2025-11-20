# 🚀 Quick Start Guide - Amankay Inn

## Frontend Setup

### 1. Install Dependencies
```powershell
cd c:\laragon\www\Amankay_SistemaWeb\frontend
npm install
```

### 2. Configure Environment
Create/update `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Start Development Server
```powershell
npm run dev
```
Frontend will be available at: `http://localhost:5173`

## Backend Setup

### 1. Install Dependencies
```powershell
cd c:\laragon\www\Amankay_SistemaWeb\backend
npm install
```

### 2. Configure Database
- Ensure MySQL is running
- Import `database.sql`:
  ```powershell
  mysql -u root -p < database.sql
  ```

### 3. Create Backend .env
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=amankay_hotel
JWT_SECRET=your_secret_key_here
PORT=3000
NODE_ENV=development
```

### 4. Start Backend Server
```powershell
npm start
```
Backend API will be available at: `http://localhost:3000`

## Testing the Application

### Public Pages (No Login Required)
- ✅ Visit `http://localhost:5173/` - Home page with hero, services, testimonials
- ✅ Visit `http://localhost:5173/rooms` - Browse all available rooms
- ✅ Click "Ver Catálogo" or room cards - Try booking (should redirect to login)

### User Authentication
- ✅ Visit `http://localhost:5173/login` - Test with existing account
- ✅ Visit `http://localhost:5173/register` - Create new account
- ✅ After login, navigate to `/reservas` - View "Mis Reservas" (My Bookings)
- ✅ Make a booking from the rooms page
- ✅ View booking in "Mis Reservas" with cancel option

### Admin Panel (Requires admin account)
- ✅ Login with admin credentials
- ✅ Navigate to `/admin/habitaciones` - Manage rooms (CRUD)
- ✅ Navigate to `/admin/reportes` - View dashboard with charts
- ✅ Navigate to `/admin/users` - Placeholder for future user management

## Key Features Implemented

### Frontend Pages
| Page | Path | Access | Features |
|------|------|--------|----------|
| Home | `/` | Public | Hero, Services, Testimonials, CTA |
| Rooms | `/rooms` | Public | Browse, Filter, Book |
| Login | `/login` | Public | User authentication |
| Register | `/register` | Public | Create account |
| My Bookings | `/reservas` | User | View, Cancel reservations |
| Admin Rooms | `/admin/habitaciones` | Admin | CRUD operations |
| Admin Reports | `/admin/reportes` | Admin | Charts, Analytics |

### Services
- `api.js` - Centralized HTTP client with interceptors
- `authService` - Login, register, logout, profile
- `roomService` - Get all rooms, details, availability
- `roomTypeService` - Get room types
- `bookingService` - Create, get, cancel bookings
- `paymentService` - Process payments

### Components
- `Layout` - Main app layout with sidebar
- `Logo` - Hotel logo component
- `Footer` - Footer with links and contact
- `BookingModal` - Booking dialog component
- `RoomCard` - Individual room display

## Troubleshooting

### Frontend doesn't load
1. Check if `npm run dev` is running
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check console for errors (F12)

### API connection errors
1. Verify backend is running (`npm start` in backend dir)
2. Check `VITE_API_URL` in `.env`
3. Ensure both run on correct ports (Backend: 3000, Frontend: 5173)
4. Check browser console Network tab for failed requests

### Database errors
1. Verify MySQL is running
2. Check database name and credentials in `.env`
3. Ensure `database.sql` was imported successfully

### Login doesn't work
1. Check if admin/user accounts exist in database
2. Verify JWT_SECRET in backend .env matches config
3. Check browser DevTools Application tab for localStorage

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms` - Create room (admin)
- `PUT /api/rooms/:id` - Update room (admin)
- `DELETE /api/rooms/:id` - Delete room (admin)

### Room Types
- `GET /api/room-types` - Get all room types
- `POST /api/room-types` - Create room type (admin)

### Bookings
- `GET /api/bookings` - Get all bookings (admin)
- `GET /api/bookings/user/:userId` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Payments
- `GET /api/payments` - Get all payments (admin)
- `POST /api/payments` - Create payment

### Reports
- `GET /api/reports` - Get reports/analytics

## Development Tips

### Add New Pages
1. Create file in `frontend/src/pages/NewPage.jsx`
2. Import in `App.jsx`
3. Add route in routes section
4. Use `useAuth` hook for auth state
5. Use services for API calls

### Style with Tailwind
- Use wood colors: `bg-wood-medium`, `text-wood-ink`
- Classes: `rounded-lg`, `shadow-md`, `hover:shadow-lg`
- Responsive: `md:grid-cols-2`, `lg:grid-cols-3`

### Add API Calls
1. Create method in appropriate service (`roomService`, `bookingService`, etc)
2. Use centralized `api` client: `api.get()`, `api.post()`, etc
3. Normalize response: `return response.data.data || response.data`
4. Use in component: `try/catch` with `toast.error()`

---

**Last Updated**: $(date)
**Status**: ✅ Production Ready
