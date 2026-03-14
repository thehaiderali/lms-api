// store/courseStore.js
import { create } from 'zustand';
import axios from 'axios';


const API_BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

const useCourseStore = create((set) => ({
  courses: [],
  currentCourse: null,
  courseLessons: [],
  courseProgress: null,
  courseAnalytics: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0
  },

  createCourse: async (courseData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/courses`, courseData);
      set((state) => ({
        courses: [response.data.data.course, ...state.courses],
        isLoading: false
      }));
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to create course',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },

  // Get all courses with filters
  getCourses: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(`${API_BASE_URL}/courses?${params}`);
      set({
        courses: response.data.data.courses,
        pagination: {
          currentPage: response.data.data.currentPage,
          totalPages: response.data.data.totalPages,
          totalCourses: response.data.data.totalCourses
        },
        isLoading: false
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to fetch courses',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },

  getCourseById: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/${courseId}`);
      set({
        currentCourse: response.data.data,
        isLoading: false
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to fetch course',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },

  updateCourse: async (courseId, courseData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_BASE_URL}/courses/${courseId}`, courseData);
      set((state) => ({
        courses: state.courses.map(c => 
          c._id === courseId ? response.data.data.course : c
        ),
        currentCourse: response.data.data.course,
        isLoading: false
      }));
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to update course',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },

  deleteCourse: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}/courses/${courseId}`);
      set((state) => ({
        courses: state.courses.filter(c => c._id !== courseId),
        currentCourse: state.currentCourse?._id === courseId ? null : state.currentCourse,
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to delete course',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },

  enrollCourse: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/courses/${courseId}/enroll`);
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to enroll in course',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },

  getCourseLessons: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/lessons`);
      set({
        courseLessons: response.data.data.lessons,
        isLoading: false
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to fetch lessons',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },

  addLessonToCourse: async (courseId, lessonData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/courses/${courseId}/lessons`, lessonData);
      set((state) => ({
        courseLessons: [...state.courseLessons, response.data.data.newLesson],
        isLoading: false
      }));
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to add lesson',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },

  
  getCourseProgress: async (courseId, studentId = null) => {
    set({ isLoading: true, error: null });
    try {
      const url = studentId 
        ? `${API_BASE_URL}/courses/${courseId}/progress?studentId=${studentId}`
        : `${API_BASE_URL}/courses/${courseId}/progress`;
      
      const response = await axios.get(url);
      set({
        courseProgress: response.data.data,
        isLoading: false
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to fetch progress',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },

  getCourseAnalytics: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/analytics`);
      set({
        courseAnalytics: response.data.data,
        isLoading: false
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to fetch analytics',
        isLoading: false
      });
      return { success: false, error: error.response?.data?.error };
    }
  },

  clearCurrentCourse: () => set({ currentCourse: null }),

  clearError: () => set({ error: null })
}));

export default useCourseStore;