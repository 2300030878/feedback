import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import Card from '../ui/Card';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import Alert from '../ui/Alert';
import { facultyAPI, facultySubjectAPI, subjectsAPI } from '../../services/api';
import Modal from '../ui/Modal';
import AsyncSearchSelect from '../ui/AsyncSearchSelect';

const AdminFaculty = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', department: '' });
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [editSubjects, setEditSubjects] = useState([]);

  const load = async (q) => {
    try {
      setLoading(true);
      const res = await facultyAPI.getAll(q ? { params: { q } } : undefined);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError('Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    try {
      setLoading(true);
      await facultyAPI.create(form);
      setForm({ name: '', email: '', department: '' });
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
      await facultyAPI.delete(id);
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
    (async () => {
      try {
        const res = await facultySubjectAPI.getByFaculty(row.facultyId);
        const mappings = Array.isArray(res.data) ? res.data : [];
        setEditSubjects(mappings.map(m => ({ subjectId: m.subject?.subjectId, subjectName: m.subject?.subjectName, subjectCode: m.subject?.subjectCode })).filter(s => s.subjectId));
      } catch (_) { setEditSubjects([]); }
    })();
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await facultyAPI.update(editRow.facultyId, editForm);
      setEditOpen(false);
      await load();
    } catch (e) {
      setError('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (opt) => {
    if (!opt?.subjectId) return;
    try {
      await facultySubjectAPI.assign(editRow.facultyId, opt.subjectId);
      const res = await facultySubjectAPI.getByFaculty(editRow.facultyId);
      const mappings = Array.isArray(res.data) ? res.data : [];
      setEditSubjects(mappings.map(m => ({ subjectId: m.subject?.subjectId, subjectName: m.subject?.subjectName, subjectCode: m.subject?.subjectCode })).filter(s => s.subjectId));
    } catch (_) {}
  };

  const handleRemoveSubject = async (subjectId) => {
    try {
      await facultySubjectAPI.remove(editRow.facultyId, subjectId);
      setEditSubjects(prev => prev.filter(s => s.subjectId !== subjectId));
    } catch (_) {}
  };

  return (
    <Layout title="Manage Faculty">
      <div className="grid grid-cols-1 gap-6">
        <Card>
            <Card.Header title="Faculty" subtitle="All faculty in the system">
              <div className="w-full md:w-1/2">
                <AsyncSearchSelect
                  fetcher={async (q) => (await facultyAPI.getAll(q ? { params: { q } } : undefined)).data}
                  onChange={(opt) => setItems(opt ? [opt] : [])}
                  placeholder="Search faculty by name or email"
                  getKey={(o) => o.facultyId}
                  getLabel={(o) => `${o.name} • ${o.email}`}
                />
              </div>
            </Card.Header>
            <Card.Content>
              {loading ? (
                <div className="py-8 text-center">Loading...</div>
              ) : (
                <div className="space-y-3">
                  {items.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">No faculty yet</div>
                  ) : (
                    items.map((f) => (
                      <div key={f.facultyId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div>
                          <div className="font-medium text-gray-900">{f.name}</div>
                          <div className="text-sm text-gray-600">{f.email}{f.department ? ` • ${f.department}` : ''}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" onClick={() => openEdit(f)}>Edit</Button>
                          <Button variant="outline" onClick={() => handleDelete(f.facultyId)}>Delete</Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card.Content>
        </Card>
      </div>

      <Modal open={editOpen} title="Edit Faculty" onClose={() => setEditOpen(false)} footer={
        <>
          <Button variant="outline" onClick={() => setEditOpen(false)} className="mr-2">Cancel</Button>
          <Button onClick={handleUpdate} loading={loading}>Save</Button>
        </>
      }>
        <div className="space-y-4">
          <FormField label="Name" type="text" name="name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          <FormField label="Email" type="email" name="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
          <div>
            <label className="form-label">Subjects</label>
            <AsyncSearchSelect
              fetcher={async (q) => (await subjectsAPI.getAll(q ? { params: { q } } : undefined)).data}
              onChange={handleAddSubject}
              placeholder="Search and add subjects"
              getKey={(o) => o.subjectId}
              getLabel={(o) => `${o.subjectName} • ${o.subjectCode}`}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {editSubjects.map((s) => (
                <span key={s.subjectId} className="inline-flex items-center px-2 py-1 text-sm bg-blue-50 text-blue-700 rounded">
                  {s.subjectName}
                  <button className="ml-2 text-blue-500 hover:text-blue-700" onClick={() => handleRemoveSubject(s.subjectId)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default AdminFaculty;

