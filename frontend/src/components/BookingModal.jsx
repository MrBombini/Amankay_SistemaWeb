import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import bookingService from '../services/bookingService';
import paymentService from '../services/paymentService';
import roomService from '../services/roomService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/solid';

export default function BookingModal({ room, open, onClose, onBooked }) {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [step, setStep] = useState('details'); // 'details', 'calendar', 'review'

  // Cargar fechas ocupadas
  useEffect(() => {
    if (room && open) {
      loadBookedDates();
    }
  }, [room, open]);

  // Calcular precio total
  useEffect(() => {
    if (checkInDate && checkOutDate && room) {
      const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      setTotalPrice(days * room.precio);
    }
  }, [checkInDate, checkOutDate, room]);

  const loadBookedDates = async () => {
    try {
      // Obtener todas las reservas de esta habitación
      // Por ahora usaremos datos simulados
      // TODO: Implementar endpoint en backend para obtener fechas ocupadas
      setBookedDates([]);
    } catch (error) {
      console.error('Error cargando fechas ocupadas:', error);
    }
  };

  const isDateBooked = (date) => {
    return bookedDates.some(bookedDate => {
      const booked = new Date(bookedDate);
      return date.getTime() === booked.getTime();
    });
  };

  const validate = () => {
    if (!checkInDate || !checkOutDate) {
      toast.error('Selecciona fechas de entrada y salida');
      return false;
    }
    if (checkOutDate <= checkInDate) {
      toast.error('La fecha de salida debe ser posterior a la de entrada');
      return false;
    }
    return true;
  };

  const handleDateChange = (date, type) => {
    if (type === 'checkIn') {
      if (checkOutDate && date >= checkOutDate) {
        toast.error('La fecha de entrada debe ser anterior a la de salida');
        return;
      }
      setCheckInDate(date);
    } else {
      if (checkInDate && date <= checkInDate) {
        toast.error('La fecha de salida debe ser posterior a la de entrada');
        return;
      }
      setCheckOutDate(date);
    }
  };

  const handleReserve = async (e) => {
    e.preventDefault();

    // Verificar si está logueado
    if (!auth || !auth.token) {
      toast.error('Debes iniciar sesión para hacer una reserva');
      onClose();
      navigate('/login');
      return;
    }

    if (!validate()) return;

    setLoading(true);
    try {
      // Crear reserva
      const bookingResp = await bookingService.createBooking({
        room_id: room.id,
        check_in_date: checkInDate.toISOString().split('T')[0],
        check_out_date: checkOutDate.toISOString().split('T')[0],
        special_requests: notes
      });

      const booking = bookingResp.data?.booking || bookingResp.booking || bookingResp.data;

      if (!booking || !booking.id) {
        toast.error('No se pudo crear la reserva');
        return;
      }

      // Crear pago
      const payResp = await paymentService.createPayment({
        booking_id: booking.id,
        amount: totalPrice,
        payment_method: 'efectivo',
        transaction_id: null
      });

      toast.success('¡Reserva confirmada! 🎉');
      onBooked && onBooked(booking);
      
      // Reset
      setCheckInDate(null);
      setCheckOutDate(null);
      setNotes('');
      setStep('details');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error al procesar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const tileClassName = ({ date }) => {
    if (isDateBooked(date)) {
      return 'booked-date';
    }
    if (checkInDate && checkOutDate && date >= checkInDate && date <= checkOutDate) {
      return 'selected-date';
    }
    if (checkInDate && date.getTime() === checkInDate.getTime()) {
      return 'check-in-date';
    }
    if (checkOutDate && date.getTime() === checkOutDate.getTime()) {
      return 'check-out-date';
    }
    return '';
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h2" className="text-2xl font-bold text-wood-ink">
                    Reservar Habitación #{room?.numero}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* STEP: DETAILS */}
                {step === 'details' && (
                  <div className="space-y-6">
                    {/* Room Details */}
                    <div className="grid md:grid-cols-2 gap-6 border-b pb-6">
                      <div>
                        <h3 className="text-xl font-bold text-wood-ink mb-4">Detalles de la Habitación</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Tipo</p>
                            <p className="text-lg font-semibold text-gray-900">{room?.tipo}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Precio por Noche</p>
                            <p className="text-lg font-bold text-wood-medium">${room?.precio}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Estado</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              room?.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                              room?.estado === 'ocupada' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {room?.estado === 'disponible' ? 'Disponible' :
                               room?.estado === 'ocupada' ? 'Ocupada' :
                               'Mantenimiento'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-wood-ink mb-4">Descripción</h3>
                        <p className="text-gray-700 leading-relaxed">
                          {room?.descripcion || 'Habitación confortable con todas las comodidades necesarias para tu estancia'}
                        </p>
                        <div className="mt-4 p-4 bg-wood-light/10 rounded-lg">
                          <p className="text-sm font-semibold text-wood-ink mb-2">Servicios Incluidos:</p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>✓ WiFi Gratis</li>
                            <li>✓ Aire Acondicionado</li>
                            <li>✓ Baño Privado</li>
                            <li>✓ TV Plasma</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => setStep('calendar')}
                        className="px-6 py-2 bg-wood-medium text-white rounded-lg hover:bg-wood-dark transition font-semibold"
                      >
                        Seleccionar Fechas
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP: CALENDAR */}
                {step === 'calendar' && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Calendar */}
                      <div>
                        <h3 className="text-lg font-bold text-wood-ink mb-4">Selecciona tu Check-in</h3>
                        <Calendar
                          onChange={(date) => handleDateChange(date, 'checkIn')}
                          value={checkInDate}
                          minDate={new Date()}
                          className="w-full border rounded-lg"
                          tileDisabled={({ date }) => isDateBooked(date)}
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-wood-ink mb-4">Selecciona tu Check-out</h3>
                        <Calendar
                          onChange={(date) => handleDateChange(date, 'checkOut')}
                          value={checkOutDate}
                          minDate={checkInDate || new Date()}
                          className="w-full border rounded-lg"
                          tileDisabled={({ date }) => isDateBooked(date) || (checkInDate && date <= checkInDate)}
                        />
                      </div>
                    </div>

                    {/* Selected Dates Summary */}
                    {checkInDate && checkOutDate && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">Resumen de tu reserva:</h4>
                        <div className="space-y-1 text-sm text-green-800">
                          <p><strong>Check-in:</strong> {checkInDate.toLocaleDateString('es-ES')}</p>
                          <p><strong>Check-out:</strong> {checkOutDate.toLocaleDateString('es-ES')}</p>
                          <p><strong>Noches:</strong> {Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))}</p>
                          <p className="text-lg font-bold text-green-900 pt-2">
                            <strong>Total:</strong> ${totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Solicitudes Especiales */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Solicitudes Especiales (opcional)</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej: Sin almohada de plumas, cama grande, etc."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        rows={3}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between gap-3">
                      <button
                        onClick={() => setStep('details')}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        ← Atrás
                      </button>
                      <div className="flex gap-3">
                        <button
                          onClick={onClose}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => setStep('review')}
                          disabled={!checkInDate || !checkOutDate}
                          className="px-6 py-2 bg-wood-medium text-white rounded-lg hover:bg-wood-dark transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Continuar →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP: REVIEW & CONFIRM */}
                {step === 'review' && (
                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <h3 className="text-lg font-bold text-wood-ink mb-4">Revisa tu Reserva</h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Habitación */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Habitación</p>
                          <p className="text-xl font-bold text-gray-900">#{room?.numero} - {room?.tipo}</p>
                        </div>

                        {/* Check-in */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Check-in</p>
                          <p className="text-xl font-bold text-gray-900">{checkInDate?.toLocaleDateString('es-ES')}</p>
                        </div>

                        {/* Check-out */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Check-out</p>
                          <p className="text-xl font-bold text-gray-900">{checkOutDate?.toLocaleDateString('es-ES')}</p>
                        </div>

                        {/* Noches */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Noches</p>
                          <p className="text-xl font-bold text-gray-900">{Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))}</p>
                        </div>
                      </div>

                      {/* Total Price */}
                      <div className="mt-6 p-4 bg-wood-light/10 rounded-lg border-2 border-wood-medium">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-700">Total a Pagar:</span>
                          <span className="text-3xl font-bold text-wood-medium">${totalPrice.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Solicitudes Especiales */}
                      {notes && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-900"><strong>Solicitudes:</strong> {notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Términos */}
                    <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                      <p className="mb-2">✓ Puedes cancelar sin penalización hasta 24 horas antes del check-in</p>
                      <p>✓ El pago se procesa al confirmar la reserva</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between gap-3">
                      <button
                        onClick={() => setStep('calendar')}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        ← Atrás
                      </button>
                      <div className="flex gap-3">
                        <button
                          onClick={onClose}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleReserve}
                          disabled={loading}
                          className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <CheckIcon className="w-5 h-5" />
                          {loading ? 'Procesando...' : 'Confirmar Reserva'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom Styles para Calendario */}
                <style>{`
                  .react-calendar {
                    width: 100%;
                    border: none;
                  }
                  .react-calendar__tile--now {
                    background: #f0f0f0;
                  }
                  .react-calendar__tile--active {
                    background: #7B502B !important;
                    color: white;
                  }
                  .react-calendar__tile:disabled {
                    background: #fee !important;
                    color: #999;
                  }
                  .booked-date {
                    background: #fee !important;
                    color: #999 !important;
                  }
                  .check-in-date,
                  .check-out-date {
                    background: #7B502B !important;
                    color: white !important;
                  }
                  .selected-date {
                    background: #BAAC8D !important;
                    color: white !important;
                  }
                `}</style>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
