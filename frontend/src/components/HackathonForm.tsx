import React, { useState, useEffect } from 'react';
import { HackathonData } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Calendar, Info, Trophy, Link, Users, Globe } from 'lucide-react';

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
    link: '',
    status: 'Upcoming',
    registration_deadline: '',
    round_1_date: '',
    result_date: '',
    final_submission_date: '',
    top_teams_date: '',
    grand_finale_date: '',
    mode: 'Online',
    team_size: '1-4',
    prize_pool: '',
    organization: '',
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
        round_1_date: initialData.round_1_date?.split('Z')[0] || '',
        result_date: initialData.result_date?.split('Z')[0] || '',
        final_submission_date: initialData.final_submission_date?.split('Z')[0] || '',
        top_teams_date: initialData.top_teams_date?.split('Z')[0] || '',
        grand_finale_date: initialData.grand_finale_date?.split('Z')[0] || '',
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
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* SECTION 1: CORE IDENTITY */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-l-2 border-primary pl-3">
          <Info className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted">Core Identity</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">Hackathon Name <span className="text-primary">*</span></label>
            <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Smart India Hackathon" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">Official Website URL</label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted/50" />
              <Input name="link" value={formData.link || ''} onChange={handleChange} placeholder="https://..." className="pl-9" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">Organizer / Host</label>
            <Input name="organization" value={formData.organization || ''} onChange={handleChange} placeholder="e.g. IIT Madras" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">Prize Pool</label>
            <Input name="prize_pool" value={formData.prize_pool || ''} onChange={handleChange} placeholder="e.g. ₹1,00,000" />
          </div>
        </div>
      </div>

      {/* SECTION 2: THE TIMELINE (MILESTONES) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-l-2 border-secondary pl-3">
          <Calendar className="h-4 w-4 text-secondary" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted">The Timeline</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">Registration Ends</label>
            <Input type="datetime-local" name="registration_deadline" value={formData.registration_deadline || ''} onChange={handleChange} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">Round 1 Date</label>
            <Input type="datetime-local" name="round_1_date" value={formData.round_1_date || ''} onChange={handleChange} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">R1 Result Date</label>
            <Input type="datetime-local" name="result_date" value={formData.result_date || ''} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">Final Submission</label>
            <Input type="datetime-local" name="final_submission_date" value={formData.final_submission_date || ''} onChange={handleChange} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">Top Teams Confirmed</label>
            <Input type="datetime-local" name="top_teams_date" value={formData.top_teams_date || ''} onChange={handleChange} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">Grand Finale</label>
            <Input type="datetime-local" name="grand_finale_date" value={formData.grand_finale_date || ''} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* SECTION 3: LOGISTICS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-l-2 border-accent pl-3">
          <Globe className="h-4 w-4 text-accent" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted">Format & Requirements</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">Mode</label>
            <Input name="mode" value={formData.mode || ''} onChange={handleChange} placeholder="Online / Hybrid" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">Team Size</label>
            <Input name="team_size" value={formData.team_size || ''} onChange={handleChange} placeholder="e.g. 2-4" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">Status</label>
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
        </div>
        <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">Round 1 Criteria & Notes</label>
            <textarea 
              name="round_1_criteria" 
              value={formData.round_1_criteria || ''} 
              onChange={handleChange} 
              placeholder="What deliverables are needed for the first round?"
              className="w-full bg-surface border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none min-h-[80px]"
            />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
        <Button type="button" variant="outline" onClick={onCancel} className="h-10 px-8">Cancel</Button>
        <Button type="submit" className="h-10 px-8 bg-primary hover:bg-primary/90">Save Entry</Button>
      </div>
    </form>
  );
};

export default HackathonForm;
