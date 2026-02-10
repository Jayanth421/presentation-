import React, { useEffect, useState } from 'react';
import api from '../services/api';
import TopBar from '../components/TopBar.jsx';

const getUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export default function Subjects() {
  const user = getUser();
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ name: '', code: '' });

  const load = async () => {
    const res = await api.get('/subjects');
    setSubjects(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/subjects', form);
    setForm({ name: '', code: '' });
    load();
  };

  const del = async (id) => {
    await api.delete(`/subjects/${id}`);
    load();
  };

  return (
    <div>
      <TopBar />
      <div className="container">
        <h2>Subjects</h2>
        {user?.role === 'Admin' && (
          <form className="form" onSubmit={submit}>
            <input placeholder="Subject Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
            <button className="btn" type="submit">Create</button>
          </form>
        )}

        <div className="table">
          <div className="row header">
            <span>Name</span><span>Code</span><span>Faculty</span><span>Classes</span><span>Actions</span>
          </div>
          {subjects.map((s) => (
            <div className="row" key={s._id}>
              <span>{s.name}</span>
              <span>{s.code}</span>
              <span>{s.assignedFaculty?.name || '-'}</span>
              <span>{(s.classes || []).length}</span>
              <span className="actions">
                {user?.role === 'Admin' && (
                  <button className="btn danger" onClick={() => del(s._id)}>Delete</button>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
