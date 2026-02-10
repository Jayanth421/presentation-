import React, { useEffect, useState } from 'react';
import api from '../services/api';
import TopBar from '../components/TopBar.jsx';
import { downloadPpt } from '../services/download';

export default function StudentDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [ppts, setPpts] = useState([]);

  const loadAll = async () => {
    const [subjectsRes, pptsRes] = await Promise.all([
      api.get('/student/subjects'),
      api.get('/ppts'),
    ]);
    setSubjects(subjectsRes.data);
    setPpts(pptsRes.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div>
      <TopBar />
      <div className="container">
        <h2>Student Dashboard</h2>

        <section>
          <h3>Assigned Subjects</h3>
          <div className="grid-3">
            {subjects.map((s) => (
              <div key={s._id} className="card">
                <div className="title">{s.name}</div>
                <div className="muted">{s.code}</div>
                <div className="small">Faculty: {s.assignedFaculty?.name || '-'}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3>Available PPTs</h3>
          <div className="table">
            <div className="row header">
              <span>Title</span><span>Subject</span><span>Download</span>
            </div>
            {ppts.map((p) => (
              <div className="row" key={p._id}>
                <span>{p.originalName}</span>
                <span>{p.subject?.name}</span>
                <span>
                  <button className="btn" onClick={() => downloadPpt(p._id, p.originalName)}>Download</button>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
