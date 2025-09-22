import React, { useState, useCallback, useEffect } from 'react';
import Layout from '../layout/Layout';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import AsyncSearchSelect from '../ui/AsyncSearchSelect';
import { subjectsAPI, eventsAPI, feedbackAPI } from '../../services/api';
import Modal from '../ui/Modal';

const AdminCreateEvent = () => {
  const [form, setForm] = useState({ title: '', subject: null, description: '', startAt: '', endAt: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [active, setActive] = useState([]);
  const [past, setPast] = useState([]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.subject || !form.startAt || !form.endAt) return;
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await eventsAPI.create({
        title: form.title,
        subjectId: form.subject.subjectId,
        description: form.description,
        startAt: form.startAt,
        endAt: form.endAt,
      });
      setSuccess('Event created successfully');
      setForm({ title: '', subject: null, description: '', startAt: '', endAt: '' });
      setShowForm(false);
      await loadLists();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const loadLists = useCallback(async () => {
    try {
      const now = new Date();
      // Try direct endpoints first
      try {
        const [a, p] = await Promise.all([
          eventsAPI.active(),
          eventsAPI.past()
        ]);
        setActive(a.data || []);
        setPast(p.data || []);
        return;
      } catch (_) {
        // Fallback: aggregate by subject if /past or /events fail
        const subs = (await subjectsAPI.getAll()).data || [];
        const lists = await Promise.all(
          subs.map(s => eventsAPI.bySubject(s.subjectId).then(r => r.data || []).catch(() => []))
        );
        const all = lists.flat();
        const activeList = all.filter(ev => new Date(ev.startAt) <= now && now < new Date(ev.endAt));
        const pastList = all.filter(ev => new Date(ev.endAt) < now);
        setActive(activeList);
        setPast(pastList);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  return (
    <Layout title="Feedback Management">
      <Card>
        <Card.Header>
          <Button onClick={() => setShowForm(true)}>Create Feedback Event</Button>
        </Card.Header>
        <Card.Content>
          {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}

          {!showForm && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <Card.Header title="Active Events" />
                <Card.Content>
                  {active.length === 0 ? (
                    <div className="text-gray-500">No active events</div>
                  ) : (
                    <ul className="space-y-2">
                      {active.map(ev => (
                        <li key={ev.eventId} className="p-3 bg-gray-50 rounded">
                          <div className="font-medium">{ev.title}</div>
                          <div className="text-sm text-gray-600">{new Date(ev.startAt).toLocaleString()} - {new Date(ev.endAt).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card.Content>
              </Card>
              <Card>
                <Card.Header title="Past Events" />
                <Card.Content>
                  {past.length === 0 ? (
                    <div className="text-gray-500">No past events</div>
                  ) : (
                    <ul className="space-y-2">
                      {past.map(ev => (
                        <li key={ev.eventId} className="p-3 bg-gray-50 rounded">
                          <div className="font-medium">{ev.title}</div>
                          <div className="text-sm text-gray-600">{new Date(ev.startAt).toLocaleString()} - {new Date(ev.endAt).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card.Content>
              </Card>
            </div>
          )}

          <Modal open={showForm} title="Create Feedback Event" onClose={() => setShowForm(false)} footer={
            <>
              <Button variant="outline" onClick={() => setShowForm(false)} className="mr-2">Cancel</Button>
              <Button onClick={submit} loading={loading}>Create Event</Button>
            </>
          }>
          <form onSubmit={(e)=>{e.preventDefault();}} className="space-y-4">
            <div>
              <label className="form-label">Title</label>
              <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">Subject</label>
              <AsyncSearchSelect
                fetcher={async (q) => (await subjectsAPI.getAll(q ? { params: { q } } : undefined)).data}
                onChange={(opt) => setForm({ ...form, subject: opt })}
                placeholder="Search subject"
                getKey={(o) => o.subjectId}
                getLabel={(o) => `${o.subjectName} • ${o.subjectCode}`}
              />
            </div>
            <div>
              <label className="form-label">Start</label>
              <input type="datetime-local" className="form-input" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">End</label>
              <input type="datetime-local" className="form-input" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">Description</label>
              <textarea className="form-input" rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </form>
          </Modal>
        </Card.Content>
      </Card>
    </Layout>
  );
};

export default AdminCreateEvent;

