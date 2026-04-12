import React, { useState, useEffect } from 'react';
import { HackathonData } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface HackathonFormProps {
  initialData?: HackathonData | null;
  onSave: (data: HackathonData) => void;
  onCancel: () => void;
  title?: string;
}

const HackathonForm = ({ initialData, onSave, onCancel, title }: HackathonFormProps) => {
  const [formData, setFormData] = useState<HackathonData>({
    title: '',
    platform: '',
    status: 'Upcoming',
    registration_deadline: '',
    submission_deadline: '',
    mode: 'Online',
    team_size: '1-4',
    fee: 'Free',
    prize_pool: '',
    organization: '',
    round_1_type: 'Concept',
    round_1_criteria: '',
    extra_rounds: '',
    final_round: '',
    checklist: {},
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        registration_deadline: initialData.registration_deadline?.split('Z')[0] || '',
        submission_deadline: initialData.submission_deadline?.split('Z')[0] || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {title && <h2 className="text-xl font-bold mb-4 gradient-text">{title}</h2>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">Hackathon Title</label>
          <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Smart India Hackathon" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">Platform / Host</label>
          <Input name="platform" value={formData.platform || ''} onChange={handleChange} placeholder="e.g. Unstop" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">Organization / College</label>
          <Input name="organization" value={formData.organization || ''} onChange={handleChange} placeholder="e.g. IIT Madras" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">Prize Pool</label>
          <Input name="prize_pool" value={formData.prize_pool || ''} onChange={handleChange} placeholder="e.g. ₹1,00,000" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">Registration Deadline</label>
          <Input type="datetime-local" name="registration_deadline" value={formData.registration_deadline || ''} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">Submission Deadline</label>
          <Input type="datetime-local" name="submission_deadline" value={formData.submission_deadline || ''} onChange={handleChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            className="w-full bg-surface border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none"
          >
            {['Upcoming', 'Live', 'Submitted', 'Selected', 'Rejected', 'Ended'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">Mode</label>
          <Input name="mode" value={formData.mode || ''} onChange={handleChange} placeholder="Online / Hybrid" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">Team Size</label>
          <Input name="team_size" value={formData.team_size || ''} onChange={handleChange} placeholder="e.g. 2-4" />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">Round 1 Details</label>
          <textarea 
            name="round_1_criteria" 
            value={formData.round_1_criteria || ''} 
            onChange={handleChange} 
            placeholder="What is needed for Round 1?"
            className="w-full bg-surface border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none min-h-[80px]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">Intermediate Rounds</label>
          <textarea 
            name="extra_rounds" 
            value={formData.extra_rounds || ''} 
            onChange={handleChange} 
            placeholder="Details for Round 2, 3..."
            className="w-full bg-surface border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none min-h-[60px]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">Final Round</label>
          <textarea 
            name="final_round" 
            value={formData.final_round || ''} 
            onChange={handleChange} 
            placeholder="What's the finale like?"
            className="w-full bg-surface border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none min-h-[60px]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Hackathon</Button>
      </div>
    </form>
  );
};

export default HackathonForm;
