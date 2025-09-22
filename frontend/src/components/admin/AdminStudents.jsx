import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { usersAPI } from '../../services/api';
import AsyncSearchSelect from '../ui/AsyncSearchSelect';
import Modal from '../ui/Modal';

const AdminStudents = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  const load = async () => {
    try {
      setLoading(true);
      const res = await usersAPI.listByRole('STUDENT');
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await usersAPI.delete(id);
      await load();
    } catch (e) {
      setError('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (row) => {
    setEditRow(row);
    setEditForm({ name: row.name || '', email: row.email || '' });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await usersAPI.update(editRow.userId, editForm);
      setEditOpen(false);
      await load();
    } catch (e) {
      setError('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Manage Students">
      <Card>
        <Card.Header title="Students" subtitle="Registered student users">
          <div className="w-full md:w-1/2">
            <AsyncSearchSelect
              fetcher={async (q) => (await usersAPI.listByRole('STUDENT', { params: { q } })).data}
              onChange={(opt) => setItems(opt ? [opt] : [])}
              placeholder="Search students by name or email"
              getKey={(o) => o.userId}
              getLabel={(o) => `${o.name} • ${o.email}`}
            />
          </div>
        </Card.Header>
        <Card.Content>
          {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}
          {loading ? (
            <div className="py-8 text-center">Loading...</div>
          ) : (
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="py-8 text-center text-gray-500">No students yet</div>
              ) : (
                items.map((u) => (
                  <div key={u.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium text-gray-900">{u.name}</div>
                      <div className="text-sm text-gray-600">{u.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => openEdit(u)}>Edit</Button>
                      <Button variant="outline" onClick={() => handleDelete(u.userId)}>Delete</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Card.Content>
      </Card>

      <Modal open={editOpen} title="Edit Student" onClose={() => setEditOpen(false)} footer={
        <>
          <Button variant="outline" onClick={() => setEditOpen(false)} className="mr-2">Cancel</Button>
          <Button onClick={handleUpdate} loading={loading}>Save</Button>
        </>
      }>
        <div className="space-y-4">
          <div>
            <label className="form-label">Name</label>
            <input className="form-input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input className="form-input" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default AdminStudents;

