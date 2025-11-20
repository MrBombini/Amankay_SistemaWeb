import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar si hay un token guardado
        const token = localStorage.getItem('token');
        if (token) {
            // refresh profile from backend
            authService.getProfile()
                .then((res) => {
                    const payload = res.data || res;
                    const user = payload.user || payload;
                    localStorage.setItem('user', JSON.stringify(user));
                    setAuth({ token, user });
                })
                .catch((err) => {
                    console.error('No se pudo refrescar perfil', err);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setAuth(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        const token = userData.token || userData.data?.token || (userData.data && userData.data.token);
        const user = userData.user || userData.data?.user || userData.data?.user || userData.data;
        if (token) localStorage.setItem('token', token);
        if (user) localStorage.setItem('user', JSON.stringify(user));
        setAuth({ token, user });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth(null);
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};