import { useEffect, useState } from 'react';
import roomService from '../services/roomService';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import RoomCard from '../components/RoomCard';
import { useAuth } from '../context/AuthContext';

export default function AdminRooms() {
  const { auth } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // room being edited
  const [form, setForm] = useState({ numero: '', tipo: '', precio: '', descripcion: '', imagen: ''});

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await roomService.getAllRooms();
      setRooms(data.rooms || []);
    } catch (err) {
      toast.error('Error cargando habitaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    // Basic frontend validation
    if (!form.numero || form.numero.length > 10) {
      toast.error('Número de habitación inválido (1-10 caracteres)');
      return;
    }
    if (!form.tipo || !form.precio) {
      toast.error('Tipo y precio son requeridos');
      return;
    }
    try {
      const payload = { ...form, precio: Number(form.precio) };
      await roomService.createRoom(payload);
      toast.success('Habitación creada');
      setForm({ numero: '', tipo: '', precio: '', descripcion: '', imagen: ''});
      loadRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al crear habitación');
      console.error(err);
    }
  };

  const startEdit = (room) => {
    setEditing(room);
    setForm({ numero: room.numero, tipo: room.tipo || '', precio: room.precio || '', descripcion: room.descripcion || '', imagen: room.imagen || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // Basic frontend validation
    if (!form.numero || form.numero.length > 10) {
      toast.error('Número de habitación inválido (1-10 caracteres)');
      return;
    }
    if (!form.tipo || !form.precio) {
      toast.error('Tipo y precio son requeridos');
      return;
    }
    try {
      const payload = { ...form, precio: Number(form.precio) };
      await roomService.updateRoom(editing.id, payload);
      toast.success('Habitación actualizada');
      setEditing(null);
      setForm({ numero: '', tipo: '', precio: '', descripcion: '', imagen: ''});
      loadRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar habitación');
      console.error(err);
    }
  };

  const handleDelete = async (room) => {
    const result = await Swal.fire({
      title: '¿Eliminar habitación?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await roomService.deleteRoom(room.id);
      toast.success('Habitación eliminada');
      loadRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar habitación');
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-wood-ink mb-4">Administrador — Habitaciones</h1>

      <form onSubmit={editing ? handleUpdate : handleCreate} className="space-y-4 bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input name="numero" value={form.numero} onChange={handleChange} placeholder="Número de habitación" className="border px-3 py-2 rounded" required />
          <input name="tipo" value={form.tipo} onChange={handleChange} placeholder="Tipo (Individual, Doble, etc.)" className="border px-3 py-2 rounded" required />
          <input name="precio" value={form.precio} onChange={handleChange} placeholder="Precio por noche" type="number" step="0.01" className="border px-3 py-2 rounded" required />
          <input name="imagen" value={form.imagen} onChange={handleChange} placeholder="URL imagen (opcional)" className="border px-3 py-2 rounded" />
        </div>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="w-full border px-3 py-2 rounded" />

        <div className="flex gap-2 justify-end">
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm({ numero: '', tipo: '', precio: '', descripcion: '', imagen: '' }); }} className="px-4 py-2 border rounded">Cancelar</button>
          )}
          <button type="submit" className="px-4 py-2 bg-wood-medium text-white rounded">{editing ? 'Actualizar' : 'Crear'}</button>
        </div>
      </form>

      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map(r => (
            <div key={r.id}>
              <RoomCard room={r} isAdmin onEdit={() => startEdit(r)} onDelete={() => handleDelete(r)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
