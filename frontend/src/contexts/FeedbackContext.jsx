import { createContext, useContext, useState } from 'react';
import { feedbackAPI, subjectsAPI, facultyAPI, analyticsAPI } from '../services/api';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Subjects
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectsAPI.getAll();
      setSubjects(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch subjects');
      setSubjects([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const createSubject = async (subjectData) => {
    try {
      setLoading(true);
      const response = await subjectsAPI.create(subjectData);
      setSubjects(prev => [...prev, response.data]);
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
      setLoading(true);
      const response = await facultyAPI.getAll();
      setFaculty(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch faculty');
      setFaculty([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const createFaculty = async (facultyData) => {
    try {
      setLoading(true);
      const response = await facultyAPI.create(facultyData);
      setFaculty(prev => [...prev, response.data]);
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
      setLoading(true);
      const response = await feedbackAPI.getAll();
      setFeedbacks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch feedbacks');
      setFeedbacks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (feedbackData) => {
    try {
      setLoading(true);
      const response = await feedbackAPI.submit(feedbackData);
      setFeedbacks(prev => [...prev, response.data]);
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

  const getOverallAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getOverallAnalytics();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch overall analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    subjects,
    faculty,
    feedbacks,
    loading,
    error,
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