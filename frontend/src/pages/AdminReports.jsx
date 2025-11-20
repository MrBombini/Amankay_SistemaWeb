import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { SparklesIcon } from '@heroicons/react/24/outline';

const COLORS = ['#7B502B', '#BAAC8D', '#A18D63', '#5D3618'];

export default function AdminReports() {
  const [reports, setReports] = useState({
    occupancy: [],
    revenue: [],
    roomTypes: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      // Simulated data - replace with actual API call
      const mockData = {
        occupancy: [
          { name: 'Lunes', ocupadas: 8, disponibles: 2 },
          { name: 'Martes', ocupadas: 7, disponibles: 3 },
          { name: 'Miércoles', ocupadas: 9, disponibles: 1 },
          { name: 'Jueves', ocupadas: 6, disponibles: 4 },
          { name: 'Viernes', ocupadas: 10, disponibles: 0 },
          { name: 'Sábado', ocupadas: 10, disponibles: 0 },
          { name: 'Domingo', ocupadas: 5, disponibles: 5 }
        ],
        revenue: [
          { name: 'Semana 1', ingresos: 2400, gastos: 800 },
          { name: 'Semana 2', ingresos: 2800, gastos: 900 },
          { name: 'Semana 3', ingresos: 3200, gastos: 950 },
          { name: 'Semana 4', ingresos: 2900, gastos: 850 }
        ],
        roomTypes: [
          { name: 'Suite', value: 35 },
          { name: 'Doble', value: 25 },
          { name: 'Individual', value: 20 },
          { name: 'Deluxe', value: 20 }
        ],
        stats: {
          totalBookings: 245,
          totalRevenue: 45800,
          occupancyRate: 82,
          cancelationRate: 8
        }
      };
      setReports(mockData);
    } catch (error) {
      toast.error('Error al cargar reportes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-wood-medium" />
        <div>
          <h1 className="text-3xl font-bold text-wood-ink">Reportes del Hotel</h1>
          <p className="text-gray-600 mt-1">Análisis de ocupación, ingresos y rendimiento</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total de Reservas', value: reports.stats.totalBookings, icon: '📊' },
          { label: 'Ingresos Totales', value: `$${reports.stats.totalRevenue}`, icon: '💰' },
          { label: 'Tasa de Ocupación', value: `${reports.stats.occupancyRate}%`, icon: '🏨' },
          { label: 'Tasa de Cancelación', value: `${reports.stats.cancelationRate}%`, icon: '❌' }
        ].map((stat, i) => (
          <div key={i} className="bg-gradient-to-br from-wood-light to-wood-beige p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-gray-700 text-sm mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-wood-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Occupancy */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-wood-ink mb-4">Ocupación Semanal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reports.occupancy}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ocupadas" fill="#7B502B" name="Ocupadas" />
              <Bar dataKey="disponibles" fill="#BAAC8D" name="Disponibles" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-wood-ink mb-4">Ingresos vs Gastos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reports.revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ingresos" stroke="#7B502B" strokeWidth={2} name="Ingresos" />
              <Line type="monotone" dataKey="gastos" stroke="#5D3618" strokeWidth={2} name="Gastos" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Room Types Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-wood-ink mb-4">Distribución de Tipos de Habitación</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reports.roomTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {reports.roomTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-wood-ink mb-4">Métricas de Desempeño</h3>
          <div className="space-y-4">
            {[
              { label: 'Satisfacción de Clientes', percentage: 92 },
              { label: 'Tasa de Ocupación', percentage: 82 },
              { label: 'Retención de Huéspedes', percentage: 78 },
              { label: 'Eficiencia Operativa', percentage: 88 }
            ].map((metric, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">{metric.label}</span>
                  <span className="text-wood-medium font-bold">{metric.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-wood-medium to-wood-beige h-2 rounded-full"
                    style={{ width: `${metric.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-8 flex justify-center">
        <button className="bg-wood-medium text-white px-6 py-3 rounded-lg font-semibold hover:bg-wood-dark transition flex items-center gap-2">
          <span>📥</span>
          Descargar Reporte PDF
        </button>
      </div>
    </div>
  );
}
