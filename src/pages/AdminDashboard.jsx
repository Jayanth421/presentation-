import React, { useEffect, useState } from 'react';
import api from '../services/api';
import TopBar from '../components/TopBar.jsx';
import { downloadPpt } from '../services/download';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, faculty: 0, subjects: 0 });
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [ppts, setPpts] = useState([]);

  const loadAll = async () => {
    const [statsRes, usersRes, subjectsRes, classesRes, pptsRes] = await Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/users'),
      api.get('/subjects'),
      api.get('/classes'),
      api.get('/ppts'),
    ]);
    setStats(statsRes.data);
    setUsers(usersRes.data);
    setSubjects(subjectsRes.data);
    setClasses(classesRes.data);
    setPpts(pptsRes.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const updateUserRole = async (id, role) => {
    await api.put(`/admin/users/${id}`, { role });
    loadAll();
  };

  const updateUserClass = async (id, classRef) => {
    await api.put(`/admin/users/${id}`, { classRef });
    loadAll();
  };

  const assignSubject = async (subjectId, facultyId, classIds) => {
    await api.put(`/admin/subjects/${subjectId}/assign`, { facultyId, classIds });
    loadAll();
  };

  const deletePpt = async (id) => {
    await api.delete(`/admin/ppts/${id}`);
    loadAll();
  };

  return (
    <div>
      <TopBar />
      <div className="container">
        <h2>Admin Dashboard</h2>
        <div className="grid-3">
          <div className="card">Students: {stats.students}</div>
          <div className="card">Faculty: {stats.faculty}</div>
          <div className="card">Subjects: {stats.subjects}</div>
        </div>

        <section>
          <h3>Users</h3>
          <div className="table">
            <div className="row header">
              <span>Name</span><span>Email</span><span>Role</span><span>Class</span><span>Actions</span>
            </div>
            {users.map((u) => (
              <div className="row" key={u._id}>
                <span>{u.name}</span>
                <span>{u.email}</span>
                <span>{u.role}</span>
                <span>{u.classRef?.name || '-'}</span>
                <span className="actions">
                  <select value={u.role} onChange={(e) => updateUserRole(u._id, e.target.value)}>
                    <option>Admin</option>
                    <option>Faculty</option>
                    <option>Student</option>
                  </select>
                  <select value={u.classRef?._id || ''} onChange={(e) => updateUserClass(u._id, e.target.value || null)}>
                    <option value="">No Class</option>
                    {classes.map((c) => (
                      <option key={c._id} value={c._id}>{c.name} {c.year}-{c.section}</option>
                    ))}
                  </select>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3>Assign Subjects</h3>
          <div className="table">
            <div className="row header">
              <span>Subject</span><span>Faculty</span><span>Classes</span><span>Save</span>
            </div>
            {subjects.map((s) => (
              <AssignRow key={s._id} subject={s} users={users} classes={classes} onSave={assignSubject} />
            ))}
          </div>
        </section>

        <section>
          <h3>PPTs</h3>
          <div className="table">
            <div className="row header">
              <span>Title</span><span>Subject</span><span>Class</span><span>Uploaded By</span><span>Actions</span>
            </div>
            {ppts.map((p) => (
              <div className="row" key={p._id}>
                <span>{p.originalName}</span>
                <span>{p.subject?.name}</span>
                <span>{p.classRef?.name}</span>
                <span>{p.uploadedBy?.name}</span>
                <span className="actions">
                  <button className="btn" onClick={() => downloadPpt(p._id, p.originalName)}>Download</button>
                  <button className="btn danger" onClick={() => deletePpt(p._id)}>Delete</button>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function AssignRow({ subject, users, classes, onSave }) {
  const facultyOptions = users.filter((u) => u.role === 'Faculty');
  const [facultyId, setFacultyId] = useState(subject.assignedFaculty?._id || '');
  const [classIds, setClassIds] = useState(subject.classes?.map((c) => c._id) || []);

  const toggleClass = (id) => {
    setClassIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  return (
    <div className="row" key={subject._id}>
      <span>{subject.name}</span>
      <span>
        <select value={facultyId} onChange={(e) => setFacultyId(e.target.value)}>
          <option value="">Unassigned</option>
          {facultyOptions.map((f) => (
            <option key={f._id} value={f._id}>{f.name}</option>
          ))}
        </select>
      </span>
      <span>
        <div className="chips">
          {classes.map((c) => (
            <label className="chip" key={c._id}>
              <input
                type="checkbox"
                checked={classIds.includes(c._id)}
                onChange={() => toggleClass(c._id)}
              />
              {c.name} {c.year}-{c.section}
            </label>
          ))}
        </div>
      </span>
      <span>
        <button className="btn" onClick={() => onSave(subject._id, facultyId, classIds)}>Save</button>
      </span>
    </div>
  );
}
