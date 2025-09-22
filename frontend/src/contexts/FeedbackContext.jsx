import { createContext, useContext, useState, useRef, useCallback } from 'react';
import { feedbackAPI, subjectsAPI, facultyAPI, analyticsAPI, usersAPI } from '../services/api';

const FeedbackContext = createContext();

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

export const FeedbackProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inFlightRef = useRef(null);
  const lastRefreshAtRef = useRef(0);

  // Subjects
  const fetchSubjects = async () => {
    try {
      const response = await subjectsAPI.getAll();
      setSubjects(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch subjects');
      setSubjects([]); // Set empty array on error
    }
  };

  const createSubject = async (subjectData) => {
    try {
      setLoading(true);
      const response = await subjectsAPI.create(subjectData);
      setSubjects(prev => [...prev, response.data]);
      try { window.dispatchEvent(new CustomEvent('feedback:data:changed', { detail: { type: 'subjects' } })); } catch (_) {}
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subject');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Faculty
  const fetchFaculty = async () => {
    try {
      const response = await facultyAPI.getAll();
      setFaculty(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch faculty');
      setFaculty([]); // Set empty array on error
    }
  };

  const createFaculty = async (facultyData) => {
    try {
      setLoading(true);
      const response = await facultyAPI.create(facultyData);
      setFaculty(prev => [...prev, response.data]);
      try { window.dispatchEvent(new CustomEvent('feedback:data:changed', { detail: { type: 'faculty' } })); } catch (_) {}
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create faculty');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Feedback
  const fetchFeedbacks = async () => {
    try {
      const response = await feedbackAPI.getAll();
      setFeedbacks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch feedbacks');
      setFeedbacks([]); // Set empty array on error
    }
  };

  const submitFeedback = async (feedbackData) => {
    try {
      setLoading(true);
      const response = await feedbackAPI.submit(feedbackData);
      setFeedbacks(prev => [...prev, response.data]);
      try { window.dispatchEvent(new CustomEvent('feedback:data:changed', { detail: { type: 'feedbacks' } })); } catch (_) {}
      try { window.dispatchEvent(new CustomEvent('feedback:events:changed')); } catch (_) {}
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Analytics
  const getSubjectAnalytics = async (subjectId) => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getSubjectAnalytics(subjectId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch subject analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFacultyAnalytics = async (facultyId) => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getFacultyAnalytics(facultyId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch faculty analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const lastAnalyticsAtRef = useRef(0);
  const cachedAnalyticsRef = useRef(null);
  const analyticsInFlightRef = useRef(null);
  const getOverallAnalytics = useCallback(async () => {
    const now = Date.now();
    if (cachedAnalyticsRef.current && now - lastAnalyticsAtRef.current < 10000) return cachedAnalyticsRef.current;
    if (analyticsInFlightRef.current) return analyticsInFlightRef.current;
    analyticsInFlightRef.current = (async () => {
      try {
        const response = await analyticsAPI.getOverallAnalytics();
        cachedAnalyticsRef.current = response.data;
        lastAnalyticsAtRef.current = Date.now();
        return cachedAnalyticsRef.current;
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch overall analytics');
        throw err;
      } finally {
        analyticsInFlightRef.current = null;
      }
    })();
    return analyticsInFlightRef.current;
  }, []);

  // Unified refresh to avoid request storms
  const refreshAll = useCallback(async () => {
    const now = Date.now();
    if (inFlightRef.current) return inFlightRef.current; // de-dup
    if (now - lastRefreshAtRef.current < 15000) return; // throttle 15s
    inFlightRef.current = (async () => {
      try {
        const [subs, facs, fbs, studs] = await Promise.all([
          subjectsAPI.getAll().catch(() => ({ data: [] })),
          facultyAPI.getAll().catch(() => ({ data: [] })),
          feedbackAPI.getAll().catch(() => ({ data: [] })),
          usersAPI.listByRole('STUDENT').catch(() => ({ data: [] })),
        ]);
        setSubjects(subs.data || []);
        setFaculty(facs.data || []);
        setFeedbacks(fbs.data || []);
        setStudentsCount(Array.isArray(studs.data) ? studs.data.length : 0);
        lastRefreshAtRef.current = Date.now();
      } catch (_) {
      } finally {
        inFlightRef.current = null;
      }
    })();
    return inFlightRef.current;
  }, []);

  const clearError = () => setError(null);

  const value = {
    subjects,
    faculty,
    feedbacks,
    loading,
    error,
    refreshAll,
    studentsCount,
    fetchSubjects,
    createSubject,
    fetchFaculty,
    createFaculty,
    fetchFeedbacks,
    submitFeedback,
    getSubjectAnalytics,
    getFacultyAnalytics,
    getOverallAnalytics,
    clearError,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};