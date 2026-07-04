import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api.js';
import { getApiErrorMessage } from '../lib/errors.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('fundsphere_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('fundsphere_token');
    if (!token) return;
    api.get('/auth/me').then((res) => {
      setUser(res.data);
      localStorage.setItem('fundsphere_user', JSON.stringify(res.data));
    }).catch((error) => {
      console.warn(getApiErrorMessage(error));
      localStorage.removeItem('fundsphere_token');
      localStorage.removeItem('fundsphere_user');
      setUser(null);
    });
  }, []);

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', payload);
      localStorage.setItem('fundsphere_token', data.token);
      localStorage.setItem('fundsphere_user', JSON.stringify(data.user));
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('fundsphere_token', data.token);
      localStorage.setItem('fundsphere_user', JSON.stringify(data.user));
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('fundsphere_token');
    localStorage.removeItem('fundsphere_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, isAuthenticated: Boolean(user) }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
