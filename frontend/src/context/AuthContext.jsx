import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = [
  { role: 'ROLE_DONOR', label: 'Green Garden Bistro', email: 'bistro@foodie.org', icon: '🍲', desc: 'Commercial Donor' },
  { role: 'ROLE_VOLUNTEER', label: 'Alex Rivera (Courier)', email: 'volunteer@foodie.org', icon: '🚲', desc: 'Rescue Courier' },
  { role: 'ROLE_NGO', label: 'Hope Harbor Food Bank', email: 'ngo@foodie.org', icon: '🤝', desc: 'Community Shelter' },
  { role: 'ROLE_ADMIN', label: 'Platform Administrator', email: 'admin@foodie.org', icon: '🛡️', desc: 'Platform Admin' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('foodie_token'));
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchProfile = useCallback(async () => {
    if (!localStorage.getItem('foodie_token')) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const userData = await api.auth.me();
      setUser(userData);
    } catch (err) {
      console.warn('Session expired or invalid, logging out', err);
      localStorage.removeItem('foodie_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!localStorage.getItem('foodie_token')) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      const data = await api.notifications.getAll();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  const login = async (email, password) => {
    const res = await api.auth.login({ email, password });
    localStorage.setItem('foodie_token', res.token);
    setToken(res.token);
    setUser(res.user);
    fetchNotifications();
    return res.user;
  };

  const register = async (userData) => {
    const res = await api.auth.register(userData);
    localStorage.setItem('foodie_token', res.token);
    setToken(res.token);
    setUser(res.user);
    fetchNotifications();
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('foodie_token');
    setToken(null);
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
  };

  const demoLogin = async (email) => {
    return await login(email, 'password123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        demoLogin,
        notifications,
        unreadCount,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
