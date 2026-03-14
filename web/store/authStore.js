// store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_BASE_URL = import.meta.BACKEND_URL || 'http://localhost:3000';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
          set({ 
            user: response.data.data.user,
            isLoading: false 
          });
          return { success: true, data: response.data.data };
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Signup failed',
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.error };
        }
      },
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
          const { token, user } = response.data.data;
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({ 
            user,
            token,
            isLoading: false 
          });
          return { success: true, data: response.data.data };
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Login failed',
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.error };
        }
      },
      getMe: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get(`${API_BASE_URL}/auth/me`);
          set({ 
            user: response.data.data.user,
            isLoading: false 
          });
          return { success: true, data: response.data.data };
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Failed to get user',
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.error };
        }
      },

      logout: () => {
        delete axios.defaults.headers.common['Authorization'];
        set({ user: null, token: null, error: null });
      },
      clearError: () => set({ error: null }),
      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },

      isTeacherOrAdmin: () => {
        const { user } = get();
        return user?.role === 'teacher' || user?.role === 'admin';
      },
      isStudent: () => {
        const { user } = get();
        return user?.role === 'student';
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default useAuthStore;