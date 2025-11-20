export default function RoomCard({ room, onBook, isAdmin, onEdit, onDelete }) {
  const statusColors = {
    disponible: 'bg-green-100 text-green-800',
    ocupada: 'bg-red-100 text-red-800',
    mantenimiento: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Habitación {room.numero}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              statusColors[room.estado]
            }`}
          >
            {room.estado}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">{room.descripcion}</p>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500">
            Tipo: {room.tipo}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            ${room.precio}/noche
          </p>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="flex justify-end space-x-3">
          {isAdmin ? (
            <>
              <button
                onClick={() => onEdit(room)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(room)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
              >
                Eliminar
              </button>
            </>
          ) : (
            room.status === 'available' && (
              <button
                onClick={() => onBook(room)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Reservar
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}