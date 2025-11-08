import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

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

  return <Layout>{children}</Layout>;
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Rutas públicas */}
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
          
          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservas"
            element={
              <ProtectedRoute>
                <h1>Mis Reservas</h1>
              </ProtectedRoute>
            }
          />
          
          {/* Rutas de administrador */}
          <Route
            path="/admin/habitaciones"
            element={
              <ProtectedRoute adminOnly>
                <h1>Admin: Habitaciones</h1>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <h1>Admin: Usuarios</h1>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reportes"
            element={
              <ProtectedRoute adminOnly>
                <h1>Admin: Reportes</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;