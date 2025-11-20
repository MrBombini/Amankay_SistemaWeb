import { Fragment, useState, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const navigation = {
  common: [
    { name: 'Inicio', href: '/', icon: HomeIcon },
    { name: 'Mi Perfil', href: '/perfil', icon: UserCircleIcon },
    { name: 'Mis Reservas', href: '/reservas', icon: CalendarIcon },
  ],
  admin: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
    { name: 'Habitaciones', href: '/admin/habitaciones', icon: BuildingOfficeIcon },
    { name: 'Usuarios', href: '/admin/users', icon: UserGroupIcon },
    { name: 'Reportes', href: '/admin/reportes', icon: ChartBarIcon },
  ],
};

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileDropdownRef = useRef(null);

  useEffect(() => {
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

  const navigationItems = auth?.user?.role === 'admin' 
    ? [...navigation.common, ...navigation.admin]
    : navigation.common;

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <div className="flex flex-col px-6 pb-4 pt-5">
                    <div className="flex items-center justify-between">
                      <Link to="/" className="flex items-center gap-3">
                        <Logo className="h-8 w-8 text-wood-medium" />
                        <span className="text-xl font-bold text-white">Amankay Inn</span>
                      </Link>
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <XMarkIcon className="h-6 w-6 text-white" />
                      </button>
                    </div>
                    <div className="mt-8">
                      <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {navigationItems.map((item) => (
                                <li key={item.name}>
                                  <Link
                                    to={item.href}
                                    className={classNames(
                                      location.pathname === item.href
                                        ? 'bg-gray-700 text-white'
                                        : 'text-gray-300 hover:bg-gray-700',
                                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                                    )}
                                  >
                                    <item.icon className="h-6 w-6 shrink-0" />
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <Link to="/" className="flex items-center gap-3">
                <Logo className="h-10 w-10 text-wood-medium" />
                <span className="text-xl font-semibold text-white">Amankay Inn</span>
              </Link>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigationItems.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={classNames(
                            location.pathname === item.href
                              ? 'bg-gray-700 text-white'
                              : 'text-gray-300 hover:bg-gray-700',
                            'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                          )}
                        >
                          <item.icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <button
                    onClick={logout}
                    className="text-gray-300 hover:bg-gray-700 group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Dropdown de Perfil en la derecha */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <UserCircleIcon className="h-6 w-6 text-wood-medium" />
                <span className="text-sm font-medium text-gray-900">{auth?.user?.name}</span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  <div className="px-4 py-3 bg-gradient-to-r from-wood-light to-wood-beige text-white">
                    <p className="font-semibold text-sm">{auth?.user?.name}</p>
                    <p className="text-xs text-wood-light/80">{auth?.user?.email}</p>
                  </div>
                  <div className="py-2">
                    {auth?.user?.role === 'admin' ? (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition text-sm font-medium"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        📊 Panel de Admin
                      </Link>
                    ) : (
                      <Link
                        to="/perfil"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition text-sm font-medium"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        👤 Mi Perfil
                      </Link>
                    )}
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
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}