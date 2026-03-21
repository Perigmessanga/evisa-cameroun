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

  async changePassword(old_password: string, new_password: string, confirm_password: string): Promise<void> {
    await api.post('/users/change-password/', { old_password, new_password, confirm_password });
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get('/users/profile/');
    return data.data || data;
  },

  async updateProfile(payload: Partial<User>): Promise<User> {
    const { data } = await api.patch('/users/profile/', payload);
    return data.data || data;
  },

  async logout(refresh: string): Promise<void> {
    await api.post('/users/auth/logout/', { refresh });
  },
};

export default authService;
