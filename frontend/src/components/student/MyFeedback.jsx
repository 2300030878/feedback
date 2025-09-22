import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFeedback } from '../../contexts/FeedbackContext';
import { MessageSquare, Star, Calendar, User, BookOpen, ArrowLeft } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import Layout from '../layout/Layout';
import { Link } from 'react-router-dom';

const MyFeedback = () => {
  const { user } = useAuth();
  const { fetchFeedbacks, feedbacks, loading } = useFeedback();
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        await fetchFeedbacks();
      } catch (error) {
        console.log('Failed to fetch feedbacks, using mock data');
      }
    };
    loadFeedbacks();
  }, [fetchFeedbacks]);

  useEffect(() => {
    if (feedbacks && Array.isArray(feedbacks) && user) {
      const userFeedbackList = feedbacks.filter(feedback => feedback.studentId === user.userId);
      setUserFeedbacks(userFeedbackList);
    } else {
      setUserFeedbacks([]);
    }
  }, [feedbacks, user]);

  // Mock data for demonstration
  const mockFeedbacks = [
    {
      id: 1,
      subject: { name: 'Data Structures' },
      faculty: { name: 'Dr. Smith' },
      rating: 4,
      comments: 'Great course with excellent explanations. The assignments were challenging but fair.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      subject: { name: 'Algorithms' },
      faculty: { name: 'Dr. Johnson' },
      rating: 5,
      comments: 'Outstanding professor! Very clear explanations and helpful office hours.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 3,
      subject: { name: 'Database Systems' },
      faculty: { name: 'Dr. Brown' },
      rating: 3,
      comments: 'Good course but could use more practical examples.',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    }
  ];

  const displayFeedbacks = (userFeedbacks && userFeedbacks.length > 0) ? userFeedbacks : mockFeedbacks;

  if (loading) {
    return (
      <Layout title="My Feedback">
        <div className="flex items-center justify-center py-10">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Feedback">
      <div className="space-y-6">
        {/* API Status Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Demo Mode
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Backend API is not connected. Showing demo feedback data for demonstration purposes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/student/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">My Feedback</h1>
            <p className="text-gray-600 mt-2">View and manage your submitted feedback</p>
          </div>
          <Button as={Link} to="/student/feedback" variant="primary">
            <MessageSquare className="h-5 w-5 mr-2" />
            Submit New Feedback
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center space-x-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{displayFeedbacks.length}</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center space-x-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {displayFeedbacks && displayFeedbacks.length > 0 
                    ? (displayFeedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / displayFeedbacks.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {displayFeedbacks && displayFeedbacks.filter(f => {
                    try {
                      const feedbackDate = new Date(f.createdAt);
                      const now = new Date();
                      return feedbackDate.getMonth() === now.getMonth() && 
                             feedbackDate.getFullYear() === now.getFullYear();
                    } catch (error) {
                      return false;
                    }
                  }).length || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Feedback List */}
        <Card>
          <Card.Header title="Your Feedback Submissions" subtitle="All feedback you have submitted">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {displayFeedbacks.length} submission{displayFeedbacks.length !== 1 ? 's' : ''}
              </span>
            </div>
          </Card.Header>
          
          <Card.Content>
            {displayFeedbacks.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback submitted yet</h3>
                <p className="text-gray-500 mb-6">Start by submitting your first feedback to help improve our academic experience.</p>
                <Button as={Link} to="/student/feedback" variant="primary">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Submit Feedback
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {displayFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-5 w-5 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {feedback.subject?.name || 'Unknown Subject'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-600">
                              {feedback.faculty?.name || 'Unknown Faculty'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill={star <= feedback.rating ? 'currentColor' : 'none'}
                              />
                            ))}
                            <span className="ml-2 text-sm font-medium text-gray-700">
                              {feedback.rating}/5
                            </span>
                          </div>
                          <StatusBadge status="resolved">
                            Submitted
                          </StatusBadge>
                        </div>
                        
                        {feedback.comments && (
                          <div className="mt-3">
                            <p className="text-gray-700 text-sm leading-relaxed">
                              "{feedback.comments}"
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 text-right">
                        <div className="text-sm text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(feedback.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </Layout>
  );
};

export default MyFeedback;