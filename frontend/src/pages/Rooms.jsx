import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import roomService from '../services/roomService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import BookingModal from '../components/BookingModal';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rooms, typeFilter, statusFilter]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await roomService.getAllRooms();
      setRooms(data.rooms || []);
    } catch (error) {
      toast.error('No se pudieron cargar las habitaciones');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let list = [...rooms];
    if (typeFilter !== 'all') {
      list = list.filter(r => r.tipo === typeFilter);
    }
    if (statusFilter !== 'all') {
      list = list.filter(r => r.estado === statusFilter);
    }
    setFiltered(list);
  };

  const openReservationModal = (room) => {
    setSelectedRoom(room);
    setBookingModalOpen(true);
  };

  const closeModal = () => {
    setBookingModalOpen(false);
    setSelectedRoom(null);
  };

  const uniqueTypes = Array.from(new Set(rooms.map(r => r.tipo).filter(Boolean)));

  if (loading) return <div className="text-center py-20">Cargando habitaciones...</div>;

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-wood-ink">Catálogo de Habitaciones</h1>
          <p className="mt-2 text-sm text-wood-ink/80">Explora nuestras habitaciones y elige la que más te guste.</p>
        </div>

        <div className="mt-4 sm:mt-0 sm:ml-6 flex gap-3">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-md border px-3 py-2">
            <option value="all">Todos los tipos</option>
            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-md border px-3 py-2">
            <option value="all">Todos los estados</option>
            <option value="available">Disponible</option>
            <option value="occupied">Ocupado</option>
            <option value="maintenance">Mantenimiento</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length > 0 ? (
          filtered.map(room => (
            <div key={room.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
              <div className="bg-wood-light/20 p-6 h-40 flex items-center justify-center text-6xl">
                🛏️
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-wood-ink">Habitación #{room.numero}</h3>
                <p className="text-gray-600 text-sm mb-3">{room.tipo || 'Tipo estándar'}</p>
                
                {/* Descripción del tipo de habitación */}
                {room.descripcion && (
                  <p className="text-gray-700 text-xs mb-3">{room.descripcion}</p>
                )}

                {/* Estado */}
                <p className="text-sm text-gray-700 mb-4">
                  <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                    room.estado === 'disponible' ? 'bg-green-100 text-green-800' : 
                    room.estado === 'ocupada' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {room.estado === 'disponible' ? 'Disponible' : 
                     room.estado === 'ocupada' ? 'Ocupada' : 
                     'Mantenimiento'}
                  </span>
                </p>

                {/* Precio */}
                <p className="text-2xl font-bold text-wood-medium mb-4">
                  ${room.precio || '100'}/noche
                </p>

                {/* Botón Reservar */}
                <button
                  onClick={() => openReservationModal(room)}
                  disabled={room.estado !== 'disponible'}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
                    room.estado === 'disponible'
                    ? 'bg-wood-medium text-white hover:bg-wood-dark'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {room.estado === 'disponible' ? 'Reservar Ahora' : 'No disponible'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-600 text-lg">No hay habitaciones que coincidan con los filtros seleccionados</p>
          </div>
        )}
      </div>

      {/* BOOKING MODAL - Componente mejorado con calendario */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          open={bookingModalOpen}
          onClose={closeModal}
          onBooked={() => {
            loadRooms();
            closeModal();
          }}
        />
      )}
    </div>
  );
}
