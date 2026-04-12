import React, { useState, useEffect } from 'react';

const HackathonForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    status: 'Upcoming',
    registration_deadline: '',
    submission_deadline: '',
    mode: 'Online',
    team_size: '2-4',
    fee: 'Free',
    round_1_type: 'PPT',
    round_1_criteria: '',
    ...initialData
  });

  const statuses = ['Upcoming', 'Live', 'Ended', 'Submitted', 'Selected', 'Rejected'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="glass-panel p-6 fade-in mb-8">
      <h2 className="text-xl mb-6 gradient-text">{initialData?.id ? 'Edit Hackathon' : 'New Hackathon (Manual)'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-muted mb-2 uppercase">Title</label>
          <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-white" />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-muted mb-2 uppercase">Platform</label>
          <input name="platform" value={formData.platform} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-white" placeholder="Unstop / Devfolio" />
        </div>

        <div>
          <label className="block text-xs font-bold text-muted mb-2 uppercase">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-white">
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-muted mb-2 uppercase">Mode</label>
          <select name="mode" value={formData.mode} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-white">
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-muted mb-2 uppercase">Submission Deadline</label>
          <input type="datetime-local" name="submission_deadline" value={formData.submission_deadline?.split('.')[0] || ''} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-white" />
        </div>

        <div>
          <label className="block text-xs font-bold text-muted mb-2 uppercase">Team Size</label>
          <input name="team_size" value={formData.team_size} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-white" />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-xs font-bold text-muted mb-2 uppercase">Round 1 Criteria</label>
        <textarea name="round_1_criteria" value={formData.round_1_criteria} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 p-4 rounded text-white h-24" />
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={() => onSave(formData)} className="btn btn-primary">Save Hackathon</button>
        <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>
    </div>
  );
};

export default HackathonForm;
