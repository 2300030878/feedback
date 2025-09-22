import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFeedback } from '../../contexts/FeedbackContext';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  Star,
  BarChart3,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import Layout from '../layout/Layout';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { 
    fetchSubjects, 
    fetchFaculty, 
    fetchFeedbacks, 
    getOverallAnalytics,
    subjects, 
    faculty, 
    feedbacks, 
    loading 
  } = useFeedback();
  
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalFaculty: 0,
    totalFeedbacks: 0,
    averageRating: 0,
  });

  useEffect(() => {
    fetchSubjects();
    fetchFaculty();
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const analyticsData = await getOverallAnalytics();
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      }
    };
    loadAnalytics();
  }, [getOverallAnalytics]);

  useEffect(() => {
    if (subjects && faculty && feedbacks) {
      const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
      const averageRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;
      
      setStats({
        totalSubjects: subjects.length,
        totalFaculty: faculty.length,
        totalFeedbacks: feedbacks.length,
        averageRating: Math.round(averageRating * 10) / 10,
      });
    }
  }, [subjects, faculty, feedbacks]);

  if (loading) {
    return (
      <Layout title="Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, description, trend }) => (
    <Card hover>
      <div className="flex items-center justify-between">
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
        {trend && (
          <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </Card>
  );

  const recentFeedbacks = feedbacks
    .slice(0, 5)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const lowRatedFeedbacks = feedbacks
    .filter(feedback => feedback.rating <= 2)
    .slice(0, 3);

  return (
    <Layout title="Admin Dashboard" showSearch>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h2>
          <p className="text-purple-100">Monitor and analyze feedback to improve academic quality.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Subjects"
            value={stats.totalSubjects}
            icon={BookOpen}
            color="bg-blue-500"
            description="Active subjects"
            trend={5}
          />
          <StatCard
            title="Faculty Members"
            value={stats.totalFaculty}
            icon={Users}
            color="bg-green-500"
            description="Registered faculty"
            trend={2}
          />
          <StatCard
            title="Total Feedback"
            value={stats.totalFeedbacks}
            icon={MessageSquare}
            color="bg-purple-500"
            description="All feedback submissions"
            trend={12}
          />
          <StatCard
            title="Average Rating"
            value={stats.averageRating}
            icon={Star}
            color="bg-orange-500"
            description="Overall satisfaction"
            trend={-3}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <Card.Header title="Quick Actions" subtitle="Common administrative tasks">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm">
                  <Link to="/admin/students">Manage Students</Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Link to="/admin/faculty">Manage Faculty</Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Link to="/admin/subjects">Manage Subjects</Link>
                </Button>
                <Button variant="primary" size="sm">
                  <Link to="/admin/analytics">View Analytics</Link>
                </Button>
              </div>
            </Card.Header>
          </Card>

          <Card>
            <Card.Header title="System Status" subtitle="Current system health">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <StatusBadge status="success">Healthy</StatusBadge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Response</span>
                  <StatusBadge status="success">Fast</StatusBadge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <StatusBadge status="active">Online</StatusBadge>
                </div>
              </div>
            </Card.Header>
          </Card>
        </div>

        {/* Recent Feedback */}
        <Card>
          <Card.Header title="Recent Feedback" subtitle="Latest feedback submissions">
            <Button variant="outline" size="sm">
              <Link to="/admin/analytics">View All</Link>
            </Button>
          </Card.Header>
          
          <Card.Content>
            {recentFeedbacks.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
                <p className="text-gray-500">Feedback will appear here once students start submitting.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {feedback.subject?.name || 'Unknown Subject'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {feedback.faculty?.name || 'Unknown Faculty'} • 
                          Rating: {feedback.rating}/5
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status="new">
                        New
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

        {/* Low Rated Feedback Alert */}
        {lowRatedFeedbacks.length > 0 && (
          <Card>
            <Card.Header title="Attention Required" subtitle="Low-rated feedback that needs review">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </Card.Header>
            
            <Card.Content>
              <div className="space-y-3">
                {lowRatedFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {feedback.subject?.name || 'Unknown Subject'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {feedback.faculty?.name || 'Unknown Faculty'} • 
                          Rating: {feedback.rating}/5
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Analytics Overview */}
        {analytics && (
          <Card>
            <Card.Header title="Analytics Overview" subtitle="Key performance indicators">
              <Button variant="primary" size="sm">
                <Link to="/admin/analytics">Detailed View</Link>
              </Button>
            </Card.Header>
            
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {analytics.averageRating || 0}
                  </div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {analytics.totalResponses || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Responses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {analytics.completionRate || 0}%
                  </div>
                  <div className="text-sm text-gray-500">Completion Rate</div>
                </div>
              </div>
            </Card.Content>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;