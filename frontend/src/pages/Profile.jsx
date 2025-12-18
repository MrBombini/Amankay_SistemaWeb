import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { CalendarIcon, CheckCircleIcon, XCircleIcon, ClockIcon, UserIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function Profile() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: auth?.user?.name || '',
    email: auth?.user?.email || '',
    phone: auth?.user?.phone || ''
  });

  useEffect(() => {
    if (!auth) {
      navigate('/login');
      return;
    }
    loadBookings();
  }, [auth, navigate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getUserBookings(auth.user.id);
      setBookings(response.bookings || []);
    } catch (error) {
      toast.error('Error al cargar tus reservas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (booking) => {
    if (booking.status === 'cancelada') {
      toast.error('Esta reserva ya ha sido cancelada');
      return;
    }

    const result = await Swal.fire({
      title: '¿Cancelar reserva?',
      text: `Se cancelará la reserva de la habitación del ${new Date(booking.check_in_date).toLocaleDateString()} al ${new Date(booking.check_out_date).toLocaleDateString()}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7B502B',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    });

    if (result.isConfirmed) {
      try {
        await bookingService.cancelBooking(booking.id);
        toast.success('Reserva cancelada correctamente');
        loadBookings();
      } catch (error) {
        toast.error('Error al cancelar la reserva');
        console.error(error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPrice = (price) => {
    if (!price) return '0.00';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const handleSaveProfile = () => {
    toast.success('Perfil actualizado correctamente');
    setIsEditing(false);
  };

  const getStatusBadge = (status) => {
    const statuses = {
      confirmada: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmada', icon: CheckCircleIcon },
      pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente', icon: ClockIcon },
      cancelada: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada', icon: XCircleIcon },
      completada: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completada', icon: CheckCircleIcon }
    };
    const s = statuses[status] || statuses.pendiente;
    const Icon = s.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${s.bg} ${s.text}`}>
        <Icon className="w-4 h-4" />
        {s.label}
      </span>
    );
  };

  if (!auth) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-wood-ink mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal y reservas</p>
        </div>

        {/* Grid Principal */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Panel de Perfil */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto bg-linear-to-br from-wood-medium to-wood-beige rounded-full flex items-center justify-center mb-4">
                  <UserIcon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-wood-ink">{auth.user.name}</h2>
                <p className="text-gray-600 text-sm">{auth.user.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
              </div>

              <hr className="my-6" />

              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-600 text-sm font-semibold">Email</label>
                    <p className="text-wood-ink font-medium mt-1">{auth.user.email}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm font-semibold">Teléfono</label>
                    <p className="text-wood-ink font-medium mt-1">{auth.user.phone || 'No registrado'}</p>
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 mt-6 px-4 py-2 text-white rounded-lg font-semibold transition"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Editar Perfil
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-600 text-sm font-semibold">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-medium focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm font-semibold">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-medium focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm font-semibold">Teléfono</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Ej: +58 412 1234567"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-medium focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <hr className="my-6" />

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}
