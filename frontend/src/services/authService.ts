// ─────────────────────────────────────────────
//  services/authService.ts
//  Gestion de l'authentification
// ─────────────────────────────────────────────
import api from './api';
import type { LoginPayload, RegisterPayload, User, AuthTokens } from '../types';

const authService = {
  async login(payload: LoginPayload): Promise<{ tokens: AuthTokens; user: User }> {
    const { data } = await api.post('/users/auth/login/', payload);
    const result = data.data || data;
    return { tokens: { access: result.access, refresh: result.refresh }, user: result.user };
  },

  async register(payload: RegisterPayload): Promise<void> {
    await api.post('/users/auth/register/', payload);
  },

  async verifyEmail(uid: string, token: string): Promise<{ tokens: AuthTokens; user: User }> {
    const { data } = await api.post('/users/auth/verify-email/', { uid, token });
    const result = data.data || data;
    return { tokens: { access: result.access, refresh: result.refresh }, user: result.user };
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/users/auth/forgot-password/', { email });
  },

  async resetPassword(uid: string, token: string, new_password: string): Promise<void> {
    await api.post('/users/auth/reset-password/', { uid, token, new_password });
  },

  async changePassword(current_password: string, new_password: string): Promise<void> {
    await api.post('/users/auth/change-password/', { current_password, new_password });
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get('/users/auth/profile/');
    return data.data || data;
  },

  async updateProfile(payload: Partial<User>): Promise<User> {
    const { data } = await api.patch('/users/auth/profile/', payload);
    return data.data || data;
  },

  async logout(refresh: string): Promise<void> {
    await api.post('/users/auth/logout/', { refresh });
  },
};

export default authService;
