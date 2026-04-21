// ─────────────────────────────────────────────
//  contexts/AuthContext.tsx
//  Gestion globale de l'authentification
// ─────────────────────────────────────────────
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '../types';
import authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; confirm_password : string; first_name: string; last_name: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  maintenanceMode: boolean;
  isMaintenanceLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isMaintenanceLoading, setIsMaintenanceLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch {
      localStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMaintenanceStatus = useCallback(async () => {
    try {
      // Direct call to API because this can fail or return 503 if maintenance mode is handled at backend level later
      const res = await fetch((import.meta.env.VITE_API_URL || 'https://charles237.pythonanywhere.com/api/v1') + '/system-settings/status/');
      if (res.ok) {
        const data = await res.json();
        setMaintenanceMode(data.maintenanceMode === true);
      }
    } catch {
      // ignore
    } finally {
      setIsMaintenanceLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaintenanceStatus();
    refreshUser();
  }, [refreshUser, fetchMaintenanceStatus]);

  const login = async (email: string, password: string) => {
    const { tokens, user: userData } = await authService.login({ email, password });
    
    // Check maintenance restrictions : ONLY Admins can log in during maintenance
    if (maintenanceMode && userData.role !== 'ADMIN') {
      throw new Error("Le portail est actuellement en maintenance. Seuls les administrateurs peuvent se connecter.");
    }
    
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    setUser(userData);
  };

  const register = async (data: { email: string; password: string; confirm_password: string; first_name: string; last_name: string; phone?: string }) => {
    await authService.register(data);
  };

  const logout = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      try {
        await authService.logout(refresh);
      } catch { /* ignore */ }
    }
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, maintenanceMode, isMaintenanceLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
