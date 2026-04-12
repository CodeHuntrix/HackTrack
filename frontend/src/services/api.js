const API_BASE = "http://localhost:8000";

export const api = {
  extractData: async (rawText) => {
    const res = await fetch(`${API_BASE}/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raw_text: rawText }),
    });
    if (!res.ok) throw new Error("Extraction failed");
    return res.json();
  },

  getHackathons: async () => {
    const res = await fetch(`${API_BASE}/hackathons`);
    return res.json();
  },

  saveHackathon: async (data, id = null) => {
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_BASE}/hackathons/${id}` : `${API_BASE}/hackathons`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteHackathon: async (id) => {
    await fetch(`${API_BASE}/hackathons/${id}`, { method: "DELETE" });
  },

  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  updateSettings: async (emails) => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ member_emails: emails }),
    });
    return res.json();
  }
};
