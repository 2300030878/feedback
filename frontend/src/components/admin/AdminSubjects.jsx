import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import Card from '../ui/Card';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import Alert from '../ui/Alert';
import { subjectsAPI } from '../../services/api';
import Modal from '../ui/Modal';
import AsyncSearchSelect from '../ui/AsyncSearchSelect';

const AdminSubjects = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ subjectCode: '', subjectName: '' });
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editForm, setEditForm] = useState({ subjectCode: '', subjectName: '' });

  const load = async (q) => {
    try {
      setLoading(true);
      const res = await subjectsAPI.getAll(q ? { params: { q } } : undefined);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.subjectCode || !form.subjectName) return;
    try {
      setLoading(true);
      await subjectsAPI.create({ subjectCode: form.subjectCode, subjectName: form.subjectName });
      setForm({ subjectCode: '', subjectName: '' });
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await subjectsAPI.delete(id);
      await load();
    } catch (e) {
      setError('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (row) => {
    setEditRow(row);
    setEditForm({ subjectCode: row.subjectCode || '', subjectName: row.subjectName || '' });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await subjectsAPI.update(editRow.subjectId, editForm);
      setEditOpen(false);
      await load();
    } catch (e) {
      setError('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Manage Subjects">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <Card.Header title="Create Subject" subtitle="Add a new subject" />
            <Card.Content>
              {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}
              <form onSubmit={handleCreate} className="space-y-4">
                <FormField
                  label="Subject Code"
                  type="text"
                  name="subjectCode"
                  value={form.subjectCode}
                  onChange={(e) => setForm({ ...form, subjectCode: e.target.value })}
                  required
                />
                <FormField
                  label="Subject Name"
                  type="text"
                  name="subjectName"
                  value={form.subjectName}
                  onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
                  required
                />
                <Button type="submit" loading={loading} className="w-full">Create</Button>
              </form>
            </Card.Content>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <Card.Header title="Subjects" subtitle="All subjects in the system">
              <div className="w-full md:w-1/2">
                <AsyncSearchSelect
                  fetcher={async (q) => (await subjectsAPI.getAll(q ? { params: { q } } : undefined)).data}
                  onChange={(opt) => setItems(opt ? [opt] : [])}
                  placeholder="Search by subject name or code"
                  getKey={(o) => o.subjectId}
                  getLabel={(o) => `${o.subjectName} • ${o.subjectCode}`}
                />
              </div>
            </Card.Header>
            <Card.Content>
              {loading ? (
                <div className="py-8 text-center">Loading...</div>
              ) : (
                <div className="space-y-3">
                  {items.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">No subjects yet</div>
                  ) : (
                    items.map((s) => (
                      <div key={s.subjectId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div>
                          <div className="font-medium text-gray-900">{s.subjectName}</div>
                          <div className="text-sm text-gray-600">{s.subjectCode}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" onClick={() => openEdit(s)}>Edit</Button>
                          <Button variant="outline" onClick={() => handleDelete(s.subjectId)}>Delete</Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>

      <Modal open={editOpen} title="Edit Subject" onClose={() => setEditOpen(false)} footer={
        <>
          <Button variant="outline" onClick={() => setEditOpen(false)} className="mr-2">Cancel</Button>
          <Button onClick={handleUpdate} loading={loading}>Save</Button>
        </>
      }>
        <div className="space-y-4">
          <FormField label="Subject Code" type="text" name="subjectCode" value={editForm.subjectCode} onChange={(e) => setEditForm({ ...editForm, subjectCode: e.target.value })} />
          <FormField label="Subject Name" type="text" name="subjectName" value={editForm.subjectName} onChange={(e) => setEditForm({ ...editForm, subjectName: e.target.value })} />
        </div>
      </Modal>
    </Layout>
  );
};

export default AdminSubjects;

