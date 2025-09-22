import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { facultyAPI, subjectsAPI, facultySubjectAPI } from '../../services/api';
import AsyncSearchSelect from '../ui/AsyncSearchSelect';

const AdminMappings = () => {
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ facultyId: '', subjectId: '' });

  const load = async () => {
    try {
      setLoading(true);
      const [fRes, sRes, mRes] = await Promise.all([
        facultyAPI.getAll(),
        subjectsAPI.getAll(),
        facultySubjectAPI.getAll(),
      ]);
      setFaculty(Array.isArray(fRes.data) ? fRes.data : []);
      setSubjects(Array.isArray(sRes.data) ? sRes.data : []);
      setMappings(Array.isArray(mRes.data) ? mRes.data : []);
    } catch (e) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!form.facultyId || !form.subjectId) return;
    try {
      setLoading(true);
      await facultySubjectAPI.assign(Number(form.facultyId), Number(form.subjectId));
      setForm({ facultyId: '', subjectId: '' });
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Assign failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (facultyId, subjectId) => {
    try {
      setLoading(true);
      await facultySubjectAPI.remove(facultyId, subjectId);
      await load();
    } catch (e) {
      setError('Remove failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Map Faculty to Subjects">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <Card.Header title="Assign Mapping" subtitle="Link a faculty to a subject" />
            <Card.Content>
              {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}
              <form onSubmit={handleAssign} className="space-y-4">
                <div>
                  <label className="form-label">Faculty</label>
                  <AsyncSearchSelect
                    fetcher={async (q) => (await facultyAPI.getAll(q ? { params: { q } } : undefined)).data}
                    value={form.facultyId}
                    onChange={(opt) => setForm({ ...form, facultyId: opt.facultyId })}
                    placeholder="Search faculty by name or email"
                    getKey={(o) => o.facultyId}
                    getLabel={(o) => `${o.name} • ${o.email}`}
                  />
                </div>
                <div>
                  <label className="form-label">Subject</label>
                  <AsyncSearchSelect
                    fetcher={async (q) => (await subjectsAPI.getAll(q ? { params: { q } } : undefined)).data}
                    value={form.subjectId}
                    onChange={(opt) => setForm({ ...form, subjectId: opt.subjectId })}
                    placeholder="Search subject by name or code"
                    getKey={(o) => o.subjectId}
                    getLabel={(o) => `${o.subjectName} • ${o.subjectCode}`}
                  />
                </div>
                <Button type="submit" loading={loading} className="w-full">Assign</Button>
              </form>
            </Card.Content>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <Card.Header title="Existing Mappings" subtitle="Faculty • Subject" />
            <Card.Content>
              {loading ? (
                <div className="py-8 text-center">Loading...</div>
              ) : (
                <div className="space-y-3">
                  {mappings.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">No mappings yet</div>
                  ) : (
                    mappings.map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="text-gray-900">
                          {m.faculty?.name} • {m.subject?.subjectName}
                        </div>
                        <Button variant="outline" onClick={() => handleRemove(m.faculty?.facultyId, m.subject?.subjectId)}>Remove</Button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminMappings;

