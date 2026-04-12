import React, { useState, useEffect } from 'react';
import { HackathonData } from '../services/api';
import { Button } from './ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from './ui/toast';
import { Input } from './ui/input';
import { CustomSelect } from './ui/custom-select';
import { Calendar, Info, Trophy, Link, Users, Globe, Zap, Wallet, Layers, ArrowRightCircle, MessageSquare, MapPin } from 'lucide-react';

interface HackathonFormProps {
  initialData?: HackathonData | null;
  onSave: (data: HackathonData) => Promise<void> | void;
  onCancel: () => void;
  isSaving?: boolean;
  title?: string;
}

const HackathonForm = ({ initialData, onSave, onCancel, isSaving }: HackathonFormProps) => {
  const [formData, setFormData] = useState<HackathonData>({
    title: '',
    platform: '',
    link: '',
    status: 'Upcoming',
    duration: '',
    fees: 'Free',
    hackathon_type: 'Project Only',
    is_direct_to_final: false,
    registration_deadline: '',
    round_1_date: '',
    result_date: '',
    final_round_date: '',
    mode: 'Online',
    team_size: '1-4',
    prize_pool: '',
    organization: '',
    round_1_criteria: '',
    extra_rounds: '',
    final_round: '',
    checklist: {},
  });

  // Helper to clean ISO strings for <input type="datetime-local">
  const formatForInput = (dateStr: any) => {
    if (!dateStr || dateStr === 'null' || dateStr === 'undefined') return '';
    const str = String(dateStr);
    if (str.length === 10) return `${str}T00:00`;
    return str.slice(0, 16);
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        registration_deadline: formatForInput(initialData.registration_deadline),
        round_1_date: formatForInput(initialData.round_1_date),
        result_date: formatForInput(initialData.result_date),
        final_round_date: formatForInput(initialData.final_round_date),
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const setFieldValue = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanData = { ...formData };
      
      // Clear screening dates if Direct to Final is enabled
      if (cleanData.is_direct_to_final) {
        cleanData.round_1_date = null;
        cleanData.result_date = null;
      }

      const dateFields = [
        'registration_deadline', 'round_1_date', 'result_date', 'final_round_date'
      ];
      dateFields.forEach(field => {
        const val = (cleanData as any)[field];
        if (!val || val === '' || val === 'null') {
          (cleanData as any)[field] = null;
        }
      });
      await onSave(cleanData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form id="hackathon-form" onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
      {/* SECTION 1: CORE IDENTITY */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-l-2 border-primary pl-3">
          <Info className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted">Core Metrics</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">Hackathon Name <span className="text-primary">*</span></label>
            <input name="title" value={formData.title} onChange={handleChange} className="form-input-custom" placeholder="e.g. Energize 2026" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">Organizer / Host</label>
            <input name="organization" value={formData.organization || ''} onChange={handleChange} className="form-input-custom" placeholder="e.g. Google, RIT" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1 flex items-center gap-1">
               <Zap className="h-3 w-3 text-yellow-400" /> Duration (Hours)
            </label>
            <input 
              type="number"
              name="duration" 
              value={formData.duration || ''} 
              onChange={handleChange} 
              className="form-input-custom" 
              placeholder="e.g. 6" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1 flex items-center gap-1">
               <Wallet className="h-3 w-3 text-green-400" /> Fees
            </label>
            <input name="fees" value={formData.fees || ''} onChange={handleChange} className="form-input-custom" placeholder="Free / ₹200" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1 flex items-center gap-1">
               <Layers className="h-3 w-3 text-secondary" /> Type
            </label>
            <CustomSelect 
              value={formData.hackathon_type || ''} 
              onChange={(val) => setFieldValue('hackathon_type', val)}
              options={['Project Only', 'PPT Only', 'Mixed']}
              icon={<Layers className="h-3 w-3 text-secondary" />}
            />
          </div>
        </div>

        {/* RE-STYLED TOGGLE ROW */}
        <div 
          onClick={() => setFieldValue('is_direct_to_final', !formData.is_direct_to_final)}
          className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${formData.is_direct_to_final ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
        >
           <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg transition-colors ${formData.is_direct_to_final ? 'bg-primary/20' : 'bg-white/5'}`}>
                 <Zap className={`h-5 w-5 ${formData.is_direct_to_final ? 'text-primary' : 'text-muted'}`} />
              </div>
              <div>
                 <p className="text-xs font-bold text-white tracking-tight">Direct to Final Event</p>
                 <p className="text-[9px] text-muted opacity-80">Check this if there is NO screening round or PPT round before the finale.</p>
              </div>
           </div>
           <div className={`w-10 h-5 rounded-full p-1 transition-colors ${formData.is_direct_to_final ? 'bg-primary' : 'bg-white/20'}`}>
              <div className={`w-3 h-3 bg-white rounded-full transition-transform ${formData.is_direct_to_final ? 'translate-x-5' : 'translate-x-0'}`} />
           </div>
        </div>
      </div>

      {/* SECTION 2: THE TIMELINE */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-l-2 border-secondary pl-3">
          <Calendar className="h-4 w-4 text-secondary" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted">The Timeline</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted ml-1">Reg. Deadline</label>
              <input type="datetime-local" name="registration_deadline" value={formData.registration_deadline || ''} onChange={handleChange} className="form-input-custom" />
           </div>
           
           {!formData.is_direct_to_final && (
              <>
                 <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted ml-1">Round 1 Date</label>
                    <input type="datetime-local" name="round_1_date" value={formData.round_1_date || ''} onChange={handleChange} className="form-input-custom" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted ml-1 text-secondary">Result Date</label>
                    <input type="datetime-local" name="result_date" value={formData.result_date || ''} onChange={handleChange} className="form-input-custom" />
                 </div>
              </>
           )}

           <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted ml-1 text-accent font-black">Final Round Date</label>
              <input type="datetime-local" name="final_round_date" value={formData.final_round_date || ''} onChange={handleChange} className="form-input-custom border-accent/20" />
           </div>
        </div>
      </div>

      {/* SECTION 3: LOGISTICS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-l-2 border-accent pl-3">
          <Globe className="h-4 w-4 text-accent" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted">Logistics & Extras</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1">Website URL</label>
            <input name="link" value={formData.link || ''} onChange={handleChange} className="form-input-custom" placeholder="https://..." />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1 flex items-center gap-1">
               <MapPin className="h-3 w-3 text-accent" /> Mode
            </label>
            <CustomSelect 
              value={formData.mode || ''} 
              onChange={(val) => setFieldValue('mode', val)}
              options={['Online', 'Offline', 'Hybrid']}
              icon={<MapPin className="h-3 w-3 text-accent" />}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1 flex items-center gap-1">
               <Trophy className="h-3 w-3 text-primary" /> Prize Pool
            </label>
            <input name="prize_pool" value={formData.prize_pool || ''} onChange={handleChange} className="form-input-custom" placeholder="₹12,000" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted ml-1 flex items-center gap-1">
               <Users className="h-3 w-3 text-secondary" /> Team Size
            </label>
            <input name="team_size" value={formData.team_size || ''} onChange={handleChange} className="form-input-custom" placeholder="2-4 members" />
          </div>
        </div>

        {/* NEW: EXTENDED DETAILS SECTION */}
        <div className="pt-4 space-y-4">
           {!formData.is_direct_to_final && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted ml-1 flex items-center gap-1">
                   <Layers className="h-3 w-3 text-primary" /> Round 1 Criteria
                </label>
                <textarea 
                  name="round_1_criteria" 
                  value={formData.round_1_criteria || ''} 
                  onChange={handleChange} 
                  className="form-textarea-custom min-h-[80px]" 
                  placeholder="Describe screening requirements, test pattern, etc." 
                />
              </div>
           )}

           <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted ml-1 flex items-center gap-1">
                 <MessageSquare className="h-3 w-3 text-secondary" /> Extra Rounds / Notes
              </label>
              <textarea 
                name="extra_rounds" 
                value={formData.extra_rounds || ''} 
                onChange={handleChange} 
                className="form-textarea-custom min-h-[80px]" 
                placeholder="Details about middle rounds, technical stacks, or special rules." 
              />
           </div>

           <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted ml-1 flex items-center gap-1">
                 <Trophy className="h-3 w-3 text-accent" /> Final Round Details
              </label>
              <textarea 
                name="final_round" 
                value={formData.final_round || ''} 
                onChange={handleChange} 
                className="form-textarea-custom min-h-[100px]" 
                placeholder="Specifics about the finale: prototype requirements, judging criteria, etc." 
              />
           </div>
        </div>
      </div>

    </form>
  );
};

export default HackathonForm;
