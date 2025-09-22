import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFeedback } from '../../contexts/FeedbackContext';
import { MessageSquare, BookOpen, Users, TrendingUp, Plus, Clock, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import Layout from '../layout/Layout';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { fetchSubjects, fetchFaculty, fetchFeedbacks, subjects, faculty, feedbacks, loading } = useFeedback();
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalFaculty: 0,
    submittedFeedback: 0,
  });

  useEffect(() => {
    fetchSubjects();
    fetchFaculty();
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (Array.isArray(subjects) && Array.isArray(faculty) && Array.isArray(feedbacks)) {
      const userFeedbacks = feedbacks.filter(feedback => feedback.studentId === user.userId);
      setStats({
        totalSubjects: subjects.length,
        totalFaculty: faculty.length,
        submittedFeedback: userFeedbacks.length,
      });
    }
  }, [subjects, faculty, feedbacks, user.userId]);

  const recentFeedbacks = (Array.isArray(feedbacks) ? feedbacks : [])
    .filter(feedback => feedback.studentId === user.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Never block dashboard; show zeros and update in background

  // Show dashboard even if data is still loading

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <Card hover>
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
          <p className="text-blue-100">Ready to share your feedback and help improve our academic experience?</p>
        </div>

        {/* Empty state notice (no mock) */}
        {Array.isArray(subjects) && Array.isArray(faculty) && subjects.length === 0 && faculty.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
            No data available yet.
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Available Subjects"
            value={stats.totalSubjects}
            icon={BookOpen}
            color="bg-blue-500"
            description="Subjects you can provide feedback for"
          />
          <StatCard
            title="Faculty Members"
            value={stats.totalFaculty}
            icon={Users}
            color="bg-green-500"
            description="Faculty you can rate"
          />
          <StatCard
            title="Submitted Feedback"
            value={stats.submittedFeedback}
            icon={MessageSquare}
            color="bg-purple-500"
            description="Your feedback submissions"
          />
          <StatCard
            title="Completion Rate"
            value={`${Math.round((stats.submittedFeedback / Math.max(stats.totalSubjects, 1)) * 100)}%`}
            icon={TrendingUp}
            color="bg-orange-500"
            description="Feedback completion progress"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Feedback */}
          <div className="lg:col-span-1">
            <Card>
              <Card.Header title="Recent Feedback" subtitle="Your latest feedback submissions">
                <Button variant="outline" size="sm">
                  <Link to="/student/my-feedback">View All</Link>
                </Button>
              </Card.Header>
              
              <Card.Content>
                {recentFeedbacks.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback submitted yet</h3>
                    <p className="text-gray-500 mb-4">Start by submitting your first feedback to help improve our academic experience.</p>
                    <Button variant="primary">
                      <Link to="/student/feedback">Submit Feedback</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentFeedbacks.map((feedback, index) => (
                      <div key={feedback.feedbackId || feedback.id || `recent-feedback-${index}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{feedback.subject?.name || feedback.subject?.subjectName || 'Unknown Subject'}</h4>
                            <p className="text-sm text-gray-500">
                              {(feedback.faculty?.name || feedback.faculty?.facultyName || 'Unknown Faculty')} • Rating: {feedback.rating}/5
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StatusBadge status="resolved">
                            Submitted
                          </StatusBadge>
                          <span className="text-sm text-gray-500">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>
        </div>

        {/* Progress Section */}
        <Card>
          <Card.Header title="Your Progress" subtitle="Track your feedback completion">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">
                {stats.submittedFeedback} of {stats.totalSubjects} completed
              </div>
            </div>
          </Card.Header>
          
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm text-gray-500">
                  {Math.round((stats.submittedFeedback / Math.max(stats.totalSubjects, 1)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((stats.submittedFeedback / Math.max(stats.totalSubjects, 1)) * 100)}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.submittedFeedback}</div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.totalSubjects - stats.submittedFeedback}</div>
                  <div className="text-sm text-gray-500">Remaining</div>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Tips Section */}
        <Card>
          <Card.Header title="Feedback Tips" subtitle="Make your feedback more effective">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'specific', title: 'Be Specific', description: 'Provide specific examples and details in your feedback.' },
                { id: 'constructive', title: 'Be Constructive', description: 'Focus on suggestions for improvement rather than just criticism.' },
                { id: 'respectful', title: 'Be Respectful', description: 'Maintain a professional and respectful tone in all feedback.' },
                { id: 'timely', title: 'Be Timely', description: 'Submit feedback while the experience is fresh in your mind.' }
              ].map((tip) => (
                <div key={tip.id} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">{tip.title}</h4>
                    <p className="text-sm text-gray-500">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card.Header>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentDashboard;