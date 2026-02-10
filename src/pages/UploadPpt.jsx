import React, { useEffect, useState } from 'react';
import api from '../services/api';
import TopBar from '../components/TopBar.jsx';

const getUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export default function UploadPpt() {
  const user = getUser();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [classId, setClassId] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const subjectsRes = user?.role === 'Faculty' ? await api.get('/faculty/subjects') : await api.get('/subjects');
      const classesRes = await api.get('/classes');
      setSubjects(subjectsRes.data);
      setClasses(classesRes.data);
    };
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Select a file');

    const data = new FormData();
    data.append('subjectId', subjectId);
    data.append('classId', classId);
    data.append('file', file);

    try {
      await api.post('/ppts/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Uploaded');
      setFile(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div>
      <TopBar />
      <div className="container">
        <h2>Upload PPT</h2>
        <form className="form" onSubmit={submit}>
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required>
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
          <select value={classId} onChange={(e) => setClassId(e.target.value)} required>
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>{c.name} {c.year}-{c.section}</option>
            ))}
          </select>
          <input type="file" accept=".ppt,.pptx" onChange={(e) => setFile(e.target.files[0])} required />
          <button className="btn" type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
}
