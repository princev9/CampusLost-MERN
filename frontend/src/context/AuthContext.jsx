import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem('campuslost_token')) { setLoading(false); return; }
    api.get('/auth/me').then(r => setUser(r.data.user)).catch(() => localStorage.removeItem('campuslost_token')).finally(() => setLoading(false));
  }, []);
  const saveSession = data => { localStorage.setItem('campuslost_token', data.token); setUser(data.user); };
  const logout = () => { localStorage.removeItem('campuslost_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, saveSession, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
