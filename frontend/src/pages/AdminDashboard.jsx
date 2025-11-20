import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import roomService from '../services/roomService';
import bookingService from '../services/bookingService';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { CheckCircleIcon, XCircleIcon, ClockIcon, TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRooms: 0,
    availableRooms: 0,
    totalUsers: 0
  });

  useEffect(() => {
    if (!auth || auth.user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [auth, navigate]);

  
  const loadData = async () => {
    
    try {
      setLoading(true);
      const [bookingsData, roomsData] = await Promise.all([
        bookingService.getAllBookings(),
        roomService.getAllRooms()
      ]);
      
      const bookingsList = bookingsData.bookings || [];
      const roomsList = roomsData.rooms || [];
        console.log("DATOS DE RESERVAS:", bookingsData);

      setBookings(bookingsData);
        setBookings(bookingsList);
      setRooms(roomsList);

      // Calcular estadísticas
      setStats({
        totalBookings: bookingsList.length,
        confirmedBookings: bookingsList.filter(b => b.status === 'confirmada').length,
        pendingBookings: bookingsList.filter(b => b.status === 'pendiente').length,
        cancelledBookings: bookingsList.filter(b => b.status === 'cancelada').length,
        totalRooms: roomsList.length,
        availableRooms: roomsList.filter(r => r.estado === 'disponible').length,
        totalUsers: 0 // Se cargaría desde una API de usuarios
      });
    } catch (error) {
      toast.error('Error al cargar datos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: '¿Confirmar reserva?',
      text: 'Esta acción confirmará la reserva del cliente',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#7B502B',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        // Aquí iría la lógica para confirmar la reserva
        toast.success('Reserva confirmada correctamente');
        loadData();
      } catch (error) {
        toast.error('Error al confirmar la reserva');
      }
    }
  };

  const handleDeleteRoom = async (roomId) => {
    const result = await Swal.fire({
      title: '¿Eliminar habitación?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        // Aquí iría la lógica para eliminar
        toast.success('Habitación eliminada correctamente');
        loadData();
      } catch (error) {
        toast.error('Error al eliminar la habitación');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      confirmada: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmada', icon: CheckCircleIcon },
      pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente', icon: ClockIcon },
      cancelada: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada', icon: XCircleIcon }
    };
    const s = statuses[status] || statuses.pendiente;
    const Icon = s.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
        <Icon className="w-3 h-3" />
        {s.label}
      </span>
    );
  };

  if (!auth || auth.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-wood-ink">Panel de Administración</h1>
          <p className="text-gray-600">Bienvenido, {auth.user.name}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-2 font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'text-wood-medium border-b-2 border-wood-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-2 font-semibold transition ${
                activeTab === 'bookings'
                  ? 'text-wood-medium border-b-2 border-wood-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📅 Reservas
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className={`py-4 px-2 font-semibold transition ${
                activeTab === 'rooms'
                  ? 'text-wood-medium border-b-2 border-wood-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🏨 Habitaciones
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-2 font-semibold transition ${
                activeTab === 'users'
                  ? 'text-wood-medium border-b-2 border-wood-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👥 Usuarios
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando...</p>
          </div>
        ) : (
          <>
            {/* DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-gray-600 font-semibold text-sm mb-2">Total Reservas</h3>
                  <p className="text-4xl font-bold text-wood-medium">{stats.totalBookings}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-gray-600 font-semibold text-sm mb-2">Confirmadas</h3>
                  <p className="text-4xl font-bold text-green-600">{stats.confirmedBookings}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-gray-600 font-semibold text-sm mb-2">Pendientes</h3>
                  <p className="text-4xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-gray-600 font-semibold text-sm mb-2">Canceladas</h3>
                  <p className="text-4xl font-bold text-red-600">{stats.cancelledBookings}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-gray-600 font-semibold text-sm mb-2">Total Habitaciones</h3>
                  <p className="text-4xl font-bold text-blue-600">{stats.totalRooms}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-gray-600 font-semibold text-sm mb-2">Disponibles</h3>
                  <p className="text-4xl font-bold text-green-600">{stats.availableRooms}</p>
                </div>
              </div>
            )}

            {/* RESERVAS */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-wood-ink">Gestión de Reservas</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Reserva ID</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Habitación</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Fechas</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">#{booking.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{booking.User?.name || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{booking.Room?.numero || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">${booking.total_price || '0.00'}</td>
                          <td className="px-6 py-4 text-sm">{getStatusBadge(booking.status)}</td>
                          <td className="px-6 py-4 text-sm">
                            {booking.status === 'pendiente' && (
                              <button
                                onClick={() => handleConfirmBooking(booking.id)}
                                className="text-wood-medium hover:text-wood-dark font-semibold"
                              >
                                Confirmar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* HABITACIONES */}
            {activeTab === 'rooms' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-wood-ink">Gestión de Habitaciones</h2>
                  <button className="bg-wood-medium text-white px-4 py-2 rounded-lg font-semibold hover:bg-wood-dark transition flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" />
                    Agregar Habitación
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Número</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Precio/Noche</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Descripción</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {rooms.map((room) => (
                        <tr key={room.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{room.numero}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{room.tipo}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">${room.precio}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              room.estado === 'disponible'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {room.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{room.descripcion || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteRoom(room.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* USUARIOS */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-wood-ink">Gestión de Usuarios</h2>
                </div>
                <div className="p-6 text-center">
                  <p className="text-gray-600">Funcionalidad de usuarios próximamente...</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
