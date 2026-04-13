import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10s timeout
});

export interface HackathonData {
  id?: number;
  title?: string;
  platform?: string;
  link?: string;
  status?: string;
  
  // Phase 3 Logistics
  duration?: string;
  fees?: string;
  hackathon_type?: string;
  is_direct_to_final?: boolean;

  // Milestone Dates
  registration_deadline?: string | null;
  round_1_date?: string | null;
  result_date?: string | null;
  final_round_date?: string | null; // RENAMED
  top_teams_date?: string | null;
  grand_finale_date?: string | null;
  
  // Details
  mode?: string;
  team_size?: string;
  prize_pool?: string;
  organization?: string;
  round_1_criteria?: string;
  extra_rounds?: string;
  final_round?: string;
  checklist?: Record<string, boolean>;
  extra_data?: any;
}

export const api = {
  getHackathons: async (): Promise<HackathonData[]> => {
    const res = await client.get('/hackathons');
    return res.data;
  },

  saveHackathon: async (data: HackathonData, id?: number): Promise<HackathonData> => {
    if (id) {
      const res = await client.put(`/hackathons/${id}`, data);
      return res.data;
    } else {
      const res = await client.post('/hackathons', data);
      return res.data;
    }
  },

  deleteHackathon: async (id: number): Promise<void> => {
    await client.delete(`/hackathons/${id}`);
  },

  extractWithAI: async (rawText: string): Promise<HackathonData> => {
    const res = await client.post('/extract', { raw_text: rawText });
    return res.data;
  }
};
