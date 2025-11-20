import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { CalendarIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function MyBookings() {
  const { auth } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <p className="text-gray-600">Cargando tus reservas...</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    if (!price) return '0.00';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(num) ? '0.00' : num.toFixed(2);
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
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${s.bg} ${s.text}`}>
        <Icon className="w-4 h-4" />
        {s.label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-wood-ink">Mis Reservas</h1>
        <p className="text-gray-600 mt-2">Aquí puedes ver y gestionar todas tus reservas en Amankay Inn</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes reservas</h3>
          <p className="text-gray-600 mb-6">¿Listo para hacer tu primera reserva?</p>
          <a href="/rooms" className="inline-block bg-wood-medium text-white px-6 py-2 rounded-lg font-semibold hover:bg-wood-dark transition">
            Ver Habitaciones
          </a>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-wood-medium to-wood-beige p-4 text-white">
                <h3 className="text-lg font-bold">Habitación #{booking.room?.numero || 'N/A'}</h3>
                <p className="text-wood-light text-sm mt-1">{booking.room?.tipo || 'Tipo de habitación'}</p>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Estado:</span>
                  {getStatusBadge(booking.status)}
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-wood-medium" />
                    <span className="text-gray-700">
                      {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {Math.ceil((new Date(booking.check_out_date) - new Date(booking.check_in_date)) / (1000 * 60 * 60 * 24))} noches
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600 flex items-center gap-1">
                    💰 Total:
                  </span>
                  <span className="text-xl font-bold text-wood-medium">
                    ${formatPrice(booking.total_price)}
                  </span>
                </div>

                {/* Special Requests */}
                {booking.special_requests && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p className="text-gray-700"><span className="font-semibold">Notas:</span> {booking.special_requests}</p>
                  </div>
                )}

                {/* Cancel Button */}
                {booking.status !== 'cancelada' && (
                  <button
                    onClick={() => handleCancel(booking)}
                    className="w-full mt-4 px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition"
                  >
                    Cancelar Reserva
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
