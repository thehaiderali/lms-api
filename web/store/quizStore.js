import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = import.meta.BACKEND_URL || 'http://localhost:3000';

const useQuizStore = create((set) => ({
  currentQuiz: null,
  quizAttempts: [],
  isLoading: false,
  error: null,

  getQuizById: async (quizId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/quizzes/${quizId}`);
      set({
        currentQuiz: response.data.data,
        isLoading: false
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to fetch quiz',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },
  updateQuiz: async (quizId, quizData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_BASE_URL}/quizzes/${quizId}`, quizData);
      set({
        currentQuiz: response.data.data,
        isLoading: false
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to update quiz',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },

  deleteQuiz: async (quizId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}/quizzes/${quizId}`);
      set({
        currentQuiz: null,
        isLoading: false
      });
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to delete quiz',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },

  clearCurrentQuiz: () => set({ currentQuiz: null }),
  clearError: () => set({ error: null })
}));

export default useQuizStore;