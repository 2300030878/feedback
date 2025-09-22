import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../layout/Layout';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { BookOpen, MessageSquare, Star, Users } from 'lucide-react';
import { facultyAPI, feedbackAPI, subjectsAPI, facultySubjectAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const Stat = ({ label, value, icon: Icon, color }) => (
  <Card hover>
    <div className="flex items-center">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </Card>
);

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [mySubjectsCount, setMySubjectsCount] = useState(0);
  const [studentsReached, setStudentsReached] = useState(0);
  const [avgRating, setAvgRating] = useState('0.0');
  const [recentCount, setRecentCount] = useState(0);
  const [recentList, setRecentList] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch all subjects and feedback, then filter by current faculty via email-based mapping if needed
        const [subjectsRes, feedbacksRes, facultyRes] = await Promise.all([
          subjectsAPI.getAll(),
          feedbackAPI.getAll(),
          facultyAPI.getAll()
        ]);
        const faculty = facultyRes.data || [];
        const me = faculty.find(f => f.email === user?.email);
        const myId = me?.facultyId;
        const allFeedback = Array.isArray(feedbacksRes.data) ? feedbacksRes.data : [];
        const mine = myId ? allFeedback.filter(f => f.facultyId === myId || f.faculty?.facultyId === myId) : [];
        setRecentCount(mine.length);
        setRecentList(mine
          .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0,5));
        if (mine.length > 0) {
          const avg = (mine.reduce((s, f) => s + (f.rating || 0), 0) / mine.length).toFixed(1);
          setAvgRating(avg);
        }
        // Count my subjects using faculty-subject mapping
        if (myId) {
          try {
            const mapRes = await facultySubjectAPI.getByFaculty(myId);
            const mappings = Array.isArray(mapRes.data) ? mapRes.data : [];
            const subjectIds = new Set(mappings.map(m => m.subject?.subjectId));
            setMySubjectsCount(subjectIds.size);
          } catch (_) {
            const subs = subjectsRes.data || [];
            setMySubjectsCount(subs.length);
          }
        }
        setStudentsReached(new Set(mine.map(f => f.studentId)).size);
      } catch (_) {
        // keep defaults
      }
    };
    load();
  }, [user]);

  const stats = useMemo(() => ([
    { label: 'My Subjects', value: mySubjectsCount, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Students Reached', value: studentsReached, icon: Users, color: 'bg-green-500' },
    { label: 'Average Rating', value: avgRating, icon: Star, color: 'bg-yellow-500' },
    { label: 'Recent Feedback', value: recentCount, icon: MessageSquare, color: 'bg-purple-500' },
  ]), [mySubjectsCount, studentsReached, avgRating, recentCount]);

  return (
    <Layout title="Faculty Dashboard">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-blue-100">Review your feedback and subjects at a glance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>

        <Card>
          <Card.Header title="Recent Feedback" subtitle="Latest feedback received from students">
            <Button variant="outline" size="sm">View All</Button>
          </Card.Header>
          <Card.Content>
            {recentList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No feedback yet.</div>
            ) : (
              <div className="space-y-3">
                {recentList.map((f) => (
                  <div key={f.feedbackId || `${f.subjectId}-${f.createdAt}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{f.subjectName || f.subject?.subjectName || 'Unknown Subject'}</div>
                      <div className="text-sm text-gray-600">Rating: {f.rating}/5</div>
                    </div>
                    <div className="text-sm text-gray-500">{new Date(f.createdAt).toLocaleDateString()}</div>
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

export default FacultyDashboard;

