import { Link } from 'react-router-dom';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-wood-ink text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="text-xl font-bold mb-4 text-wood-light">Amankay Inn</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Tu refugio de confort y calidez en el corazón de la ciudad. Disfruta de una experiencia única con nuestro servicio personalizado.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-wood-light">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-wood-light transition">Inicio</Link></li>
              <li><Link to="/rooms" className="text-gray-300 hover:text-wood-light transition">Habitaciones</Link></li>
              <li><a href="#servicios" className="text-gray-300 hover:text-wood-light transition">Servicios</a></li>
              <li><a href="#contacto" className="text-gray-300 hover:text-wood-light transition">Contacto</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-wood-light">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <PhoneIcon className="w-5 h-5 text-wood-beige" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <EnvelopeIcon className="w-5 h-5 text-wood-beige" />
                <span className="text-gray-300">info@amankay.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-wood-beige" />
                <span className="text-gray-300">Calle Principal 123</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-wood-light">Síguenos</h4>
            <div className="flex gap-4">
              <a href="#facebook" className="bg-wood-medium p-2 rounded hover:bg-wood-beige transition text-sm font-bold">
                f
              </a>
              <a href="#instagram" className="bg-wood-medium p-2 rounded hover:bg-wood-beige transition text-sm font-bold">
                📷
              </a>
              <a href="#twitter" className="bg-wood-medium p-2 rounded hover:bg-wood-beige transition text-sm font-bold">
                𝕏
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-wood-medium pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © {currentYear} Amankay Inn. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0 text-sm">
              <a href="#privacy" className="text-gray-400 hover:text-wood-light transition">
                Política de Privacidad
              </a>
              <a href="#terms" className="text-gray-400 hover:text-wood-light transition">
                Términos de Servicio
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
