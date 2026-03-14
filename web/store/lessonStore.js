
import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = import.meta.BACKEND_URL || 'http://localhost:3000';

const useLessonStore = create((set) => ({
  currentLesson: null,
  lessonQuiz: null,
  isLoading: false,
  error: null,

  getLessonById: async (lessonId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/lessons/${lessonId}`);
      set({
        currentLesson: response.data.data.lesson,
        isLoading: false
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to fetch lesson',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },


  updateLesson: async (lessonId, lessonData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_BASE_URL}/lessons/${lessonId}`, lessonData);
      set({
        currentLesson: response.data.data.updatedLesson,
        isLoading: false
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to update lesson',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },

  deleteLesson: async (lessonId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}/lessons/${lessonId}`);
      set({
        currentLesson: null,
        isLoading: false
      });
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to delete lesson',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },

  addQuizToLesson: async (lessonId, quizData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/lessons/${lessonId}/quiz`, quizData);
      set({
        lessonQuiz: response.data.data.quiz,
        isLoading: false
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to add quiz',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },

  completeLesson: async (lessonId, timeSpent) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/lessons/${lessonId}/complete`, { timeSpent });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to complete lesson',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },

  clearCurrentLesson: () => set({ currentLesson: null }),
  clearError: () => set({ error: null })
}));

export default useLessonStore;