import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import Card from '../ui/Card';
import { analyticsAPI } from '../../services/api';

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await analyticsAPI.getOverallAnalytics();
        setData(res.data);
      } catch (e) {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Layout title="Analytics">
      <Card>
        <Card.Header title="Overall Analytics" subtitle="Live KPIs from database" />
        <Card.Content>
          {loading && <div className="py-8 text-center">Loading...</div>}
          {error && <div className="py-8 text-center text-red-600">{error}</div>}
          {data && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{data.averageRating?.toFixed?.(1) || data.averageRating || 0}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{data.totalFeedbacks || 0}</div>
                <div className="text-sm text-gray-600">Total Feedback</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{data.topSubjects?.length || 0}</div>
                <div className="text-sm text-gray-600">Subjects in Analytics</div>
              </div>
            </div>
          )}
        </Card.Content>
      </Card>
    </Layout>
  );
};

export default AdminAnalytics;

