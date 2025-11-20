import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StarIcon, ChevronRightIcon, MapPinIcon, UsersIcon, SparklesIcon, WifiIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useState, useEffect, useRef } from 'react';
import roomService from '../services/roomService';
import BookingModal from '../components/BookingModal';

export default function Home() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedTestimonial, setSelectedTestimonial] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Cerrar dropdown cuando hace click afuera
    const handleClickOutside = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [profileDropdownOpen]);

  const loadData = async () => {
    try {
      const roomsData = await roomService.getAllRooms();
      console.log('📥 Datos recibidos del servidor:', roomsData);
      // roomsData = { rooms: [...] }
      const allRooms = roomsData.rooms || [];
      console.log(`✅ Total habitaciones en BD: ${allRooms.length}`);
      // Mostrar todas las habitaciones disponibles, o todas si ninguna está disponible
      const availableRooms = allRooms.filter(r => r.estado === 'disponible');
      const roomsToShow = availableRooms.length > 0 ? availableRooms : allRooms;
      console.log(`📋 Habitaciones a mostrar: ${roomsToShow.length}`);
      setRooms(roomsToShow);
    } catch (error) {
      console.error('❌ Error cargando habitaciones:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const openBookingModal = (room) => {
    setSelectedRoom(room);
    setBookingModalOpen(true);
  };

  const handleBookingClose = () => {
    setBookingModalOpen(false);
    setSelectedRoom(null);
  };

  const testimonials = [
    {
      name: 'María García',
      role: 'Turista',
      text: 'Mi estadía en Amankay Inn fue absolutamente perfecta. El servicio fue impecable y las habitaciones muy cómodas. Definitivamente volveré.',
      rating: 5,
      avatar: '👩‍🦰'
    },
    {
      name: 'Juan Rodríguez',
      role: 'Ejecutivo',
      text: 'Excelente ubicación, excelente atención. El personal fue muy amable y las instalaciones de primera calidad. Recomendado 100%.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Laura López',
      role: 'Viajera',
      text: 'El mejor hotel donde he estado. Todo detalles cuidados, desde la limpieza hasta el desayuno. Una experiencia inolvidable.',
      rating: 5,
      avatar: '👩‍🦱'
    }
  ];

  const gallery = [
    { emoji: '🏨', alt: 'Fachada principal' },
    { emoji: '🛏️', alt: 'Habitaciones' },
    { emoji: '🍽️', alt: 'Restaurante' },
    { emoji: '🏊', alt: 'Piscina' },
    { emoji: '💆', alt: 'Spa' },
    { emoji: '🌅', alt: 'Vistas' },
  ];

  const services = [
    {
      icon: '🛏️',
      title: 'Habitaciones Premium',
      desc: 'Diseñadas con confort en mente. Todas nuestras habitaciones cuentan con amenidades de lujo y vistas hermosas.'
    },
    {
      icon: '🍽️',
      title: 'Restaurante Gastronómico',
      desc: 'Disfruta de comida exquisita preparada por chefs experimentados con ingredientes de primera calidad.'
    },
    {
      icon: '🏊',
      title: 'Piscina Climatizada',
      desc: 'Relájate en nuestra piscina olímpica con zona infantil y bar de bebidas incluido.'
    },
    {
      icon: '💆',
      title: 'Spa y Bienestar',
      desc: 'Masajes terapéuticos, sauna y tratamientos de belleza para tu relajación total.'
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-wood-light/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-wood-medium">🏨</span>
            <span className="text-xl font-bold text-wood-ink">Amankay Inn</span>
          </div>
          
          <div className="hidden md:flex gap-8">
            <a href="#hero" className="text-gray-600 hover:text-wood-medium transition font-medium">Inicio</a>
            <a href="#rooms" className="text-gray-600 hover:text-wood-medium transition font-medium">Habitaciones</a>
            <a href="#services" className="text-gray-600 hover:text-wood-medium transition font-medium">Servicios</a>
            <a href="#testimonials" className="text-gray-600 hover:text-wood-medium transition font-medium">Testimonios</a>
          </div>

          <div className="flex gap-3 items-center">
            {auth ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <UserCircleIcon className="w-6 h-6 text-wood-medium" />
                  <span className="hidden sm:inline text-wood-ink font-medium">{auth.user.name}</span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gradient-to-r from-wood-light to-wood-beige text-white">
                      <p className="font-semibold text-sm">{auth.user.name}</p>
                      <p className="text-xs text-wood-light/80">{auth.user.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/perfil"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition text-sm font-medium"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        👤 Mi Perfil
                      </Link>
                      <Link
                        to="/reservas"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition text-sm font-medium"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        📅 Mis Reservas
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition text-sm font-medium"
                      >
                        🚪 Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-wood-medium font-semibold hover:text-wood-dark transition">
                  Iniciar Sesión
                </Link>
                <Link to="/rooms" className="bg-wood-medium text-white px-4 py-2 rounded-lg font-semibold hover:bg-wood-dark transition">
                  Reservar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="hero" className="relative bg-gradient-to-br from-wood-dark via-wood-medium to-wood-beige text-white py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-6xl font-bold mb-6 leading-tight">
                Bienvenido a <span className="text-wood-light">Amankay Inn</span>
              </h1>
              <p className="text-xl text-wood-light/90 mb-8 leading-relaxed">
                Tu refugio de confort y calidez en el corazón de la ciudad. Descubre una experiencia única donde lujo y calidez se unen para hacer memorable cada momento.
              </p>
              
              <div className="flex gap-4 flex-wrap">
                <Link 
                  to="/rooms"
                  className="bg-white text-wood-dark px-8 py-4 rounded-lg font-bold hover:bg-wood-light transition flex items-center gap-2 group"
                >
                  Ver Catálogo
                  <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>
                {!auth && (
                  <Link
                    to="/login"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition"
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </div>

              <div className="mt-12 flex gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5" />
                  <span>+5000 Huéspedes Felices</span>
                </div>
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5" />
                  <span>10+ Años de Excelencia</span>
                </div>
              </div>
            </div>

            <div className="relative h-96 animate-fade-in-delayed">
              <div className="absolute inset-0 bg-gradient-to-r from-wood-light/30 to-transparent rounded-3xl"></div>
              <div className="text-9xl text-center mt-20 opacity-60">🏨</div>
            </div>
          </div>
        </div>
      </section>

      {/* ALL ROOMS GALLERY SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-wood-ink mb-4">Catálogo Completo de Habitaciones</h2>
            <p className="text-xl text-gray-600">Explora todas nuestras opciones de alojamiento</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">Cargando habitaciones...</p>
              </div>
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                  <div className="bg-gradient-to-br from-wood-light to-wood-beige h-32 flex items-center justify-center text-5xl">
                    🏨
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-wood-ink">{room.tipo}</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {room.estado === 'disponible' ? 'Disponible' : room.estado}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Habitación #{room.numero}</p>
                    {room.descripcion && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{room.descripcion}</p>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-xl font-bold text-wood-medium">${room.precio}/noche</span>
                      <button 
                        onClick={() => openBookingModal(room)}
                        className="px-3 py-1 bg-wood-medium text-white text-sm rounded hover:bg-wood-dark transition"
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No hay habitaciones disponibles</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-wood-ink mb-4">Galería de Imágenes</h2>
            <p className="text-xl text-gray-600">Descubre la belleza de nuestras instalaciones</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.map((item, i) => (
              <div
                key={i}
                className="h-64 bg-gradient-to-br from-wood-light to-wood-beige rounded-2xl flex items-center justify-center text-8xl hover:scale-105 transition cursor-pointer shadow-lg hover:shadow-xl"
              >
                {item.emoji}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-wood-ink mb-4">Nuestros Servicios</h2>
            <p className="text-xl text-gray-600">Todo lo que necesitas para una estancia perfecta</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
              >
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-wood-ink mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-wood-ink mb-4">Lo que Dicen Nuestros Huéspedes</h2>
            <p className="text-xl text-gray-600">Testimonios reales de clientes satisfechos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <div
                key={i}
                className={`p-8 rounded-2xl transition cursor-pointer transform hover:scale-105 ${
                  selectedTestimonial === i
                    ? 'bg-wood-medium text-white shadow-2xl'
                    : 'bg-gray-50 border border-wood-light/20 hover:border-wood-medium'
                }`}
                onClick={() => setSelectedTestimonial(i)}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl">{test.avatar}</div>
                  <div>
                    <h3 className={`font-bold text-lg ${selectedTestimonial === i ? 'text-white' : 'text-wood-ink'}`}>
                      {test.name}
                    </h3>
                    <p className={`text-sm ${selectedTestimonial === i ? 'text-wood-light' : 'text-gray-600'}`}>
                      {test.role}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: test.rating }).map((_, j) => (
                    <StarIcon
                      key={j}
                      className={`w-5 h-5 ${selectedTestimonial === i ? 'text-yellow-300' : 'text-yellow-400'}`}
                    />
                  ))}
                </div>

                <p className={`leading-relaxed ${selectedTestimonial === i ? 'text-white' : 'text-gray-700'}`}>
                  "{test.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL SECTION */}
      <section className="py-20 bg-gradient-to-r from-wood-dark to-wood-medium text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">¿Listo para tu próxima aventura?</h2>
          <p className="text-xl mb-10 text-wood-light/90">
            Reserva ahora y disfruta de una experiencia inolvidable en Amankay Inn
          </p>
          <Link
            to="/rooms"
            className="inline-block bg-white text-wood-medium px-10 py-4 rounded-lg font-bold hover:bg-wood-light transition text-lg"
          >
            Explorar Habitaciones →
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease forwards;
        }

        .animate-fade-in-delayed {
          animation: fade-in 0.8s ease forwards 0.2s;
          opacity: 0;
        }
      `}</style>

      {/* BOOKING MODAL */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          open={bookingModalOpen}
          onClose={handleBookingClose}
          onBooked={(booking) => {
            console.log('Reserva creada:', booking);
            handleBookingClose();
          }}
        />
      )}
    </div>
  );
}