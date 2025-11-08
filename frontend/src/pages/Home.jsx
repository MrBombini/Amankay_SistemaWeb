import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import roomService from '../services/roomService';
import RoomCard from '../components/RoomCard';
import toast from 'react-hot-toast';

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getAllRooms(auth.token);
      setRooms(response.data.rooms);
    } catch (error) {
      toast.error('Error al cargar las habitaciones');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (room) => {
    // Implementar lógica de reserva
    console.log('Reservar habitación:', room);
  };

  const handleEdit = (room) => {
    // Implementar lógica de edición
    console.log('Editar habitación:', room);
  };

  const handleDelete = async (room) => {
    if (!window.confirm('¿Está seguro de eliminar esta habitación?')) return;

    try {
      await roomService.deleteRoom(auth.token, room.id);
      toast.success('Habitación eliminada correctamente');
      loadRooms();
    } catch (error) {
      toast.error('Error al eliminar la habitación');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Habitaciones</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todas las habitaciones disponibles en el hotel.
          </p>
        </div>
        {auth?.user?.role === 'admin' && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Agregar habitación
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onBook={handleBook}
            isAdmin={auth?.user?.role === 'admin'}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}