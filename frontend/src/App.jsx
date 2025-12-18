import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import AdminRooms from './pages/AdminRooms';
import AdminReports from './pages/AdminReports';

// Componente de ruta protegida
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { auth, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!auth) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && auth.user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Layout>{children}</Layout>
      <Footer />
    </>
  );
};

// Componente de ruta pública (no accesible si está autenticado)
const PublicRoute = ({ children }) => {
  const { auth, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (auth) {
    return <Navigate to="/" />;
  }

  return children;
};

// Componente para rutas públicas con Footer (SIN Layout/Sidebar)
const PublicLayoutRoute = ({ children }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

function App() {
  return (
    <div className="bg-gray-50">
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Rutas públicas de autenticación */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          
          {/* Rutas públicas con Footer */}
          <Route
            path="/"
            element={
              <PublicLayoutRoute>
                <Home />
              </PublicLayoutRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <PublicLayoutRoute>
                <Rooms />
              </PublicLayoutRoute>
            }
          />

          {/* Rutas protegidas de usuario */}
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservas"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          
          {/* Rutas de administrador */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/habitaciones"
            element={
              <ProtectedRoute adminOnly>
                <AdminRooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reportes"
            element={
              <ProtectedRoute adminOnly>
                <AdminReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <div className="max-w-7xl mx-auto px-4 py-8">
                  <h1 className="text-3xl font-bold text-wood-ink">Gestión de Usuarios</h1>
                  <p className="text-gray-600 mt-4">Próximamente...</p>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
    </div>
  );
}

export default App;