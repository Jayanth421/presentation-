import React, { useEffect, useState } from 'react';
import api from '../services/api';
import TopBar from '../components/TopBar.jsx';

const getUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export default function Classes() {
  const user = getUser();
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: '', year: '', section: '' });

  const load = async () => {
    const res = await api.get('/classes');
    setClasses(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/classes', form);
    setForm({ name: '', year: '', section: '' });
    load();
  };

  const del = async (id) => {
    await api.delete(`/classes/${id}`);
    load();
  };

  return (
    <div>
      <TopBar />
      <div className="container">
        <h2>Classes</h2>
        {user?.role === 'Admin' && (
          <form className="form" onSubmit={submit}>
            <input placeholder="Class Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
            <input placeholder="Section" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} required />
            <button className="btn" type="submit">Create</button>
          </form>
        )}

        <div className="table">
          <div className="row header">
            <span>Name</span><span>Year</span><span>Section</span><span>Actions</span>
          </div>
          {classes.map((c) => (
            <div className="row" key={c._id}>
              <span>{c.name}</span>
              <span>{c.year}</span>
              <span>{c.section}</span>
              <span className="actions">
                {user?.role === 'Admin' && (
                  <button className="btn danger" onClick={() => del(c._id)}>Delete</button>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
