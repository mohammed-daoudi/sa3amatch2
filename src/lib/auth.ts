import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { supabase } from './supabase';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const isAdmin = (): boolean => {
  const user = useAuthStore.getState().user;
  return user?.role === 'admin';
};

export const requireAuth = (): boolean => {
  return useAuthStore.getState().isAuthenticated;
};