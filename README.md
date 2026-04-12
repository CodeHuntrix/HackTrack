# 🚀 HackTrack

**Master your hackathon journey with AI-powered tracking.**

HackTrack is a premium full-stack utility designed for hackathon teams to eliminate last-minute rushes, inconsistent PPTs, and disorganized workflows. It turns messy hackathon webpage text into a structured, actionable dashboard in seconds.

---

## ✨ Key Features

- **🪄 Magic Paste (AI Mode)**: Powered by **Groq Llama 3.3-70B**. Paste raw text from Unstop, Devfolio, or any college hackathon site, and watch as it automatically extracts deadlines, round criteria, team sizes, and venue details.
- **📊 Smart List View**: A modern, high-density dashboard. See your countdowns and status at a glance, or expand a row to dive into the "Noise Drawer" (prizes, contacts, rules).
- **🔄 Status Lifecycle**: Track your progress from `Upcoming` → `Live` → `Submitted` → `Selected` or `Rejected`.
- **✅ Submission Checklist**: Built-in tracking for `PPT`, `Video`, `Code`, and `Idea Doc` for every event.
- **🛠️ Manual Flex**: Full support for manual entry and direct editing if you need to override AI extractions.
- **✉️ Automated Reminders (Coming Soon)**: A 7-stage email notification engine (30d, 14d, 7d, 3d, 2d, 1d, 0d) to keep the whole team synced.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite) + Vanilla CSS (Neon Midnight Theme)
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL (Primes for Render deployment)
- **AI Engine**: Groq API (Llama-3.3-70b-versatile)
- **Deployment**: Optimized for Render (BE) and Vercel (FE)

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.9+
- Node.js & npm
- Groq API Key

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```
Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL=postgresql://user:password@localhost/hacktrack
GROQ_API_KEY=your_key_here
```
Run the server:
```bash
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🤝 For Collaborators

If you are joining the team to work on a specific module (e.g., the Email system), please refer to the [COLLABORATOR_AI_PROMPT.md](./COLLABORATOR_AI_PROMPT.md) for a technical brief and "AI-to-AI" handoff instructions.

---

## 📁 Project Structure

```text
HackTrack/
├── frontend/             # React application
│   ├── src/components/   # Dashboard, SmartList, MagicPaste
│   └── src/services/     # API bridge
├── backend/              # FastAPI application
│   ├── services/         # Groq AI logic
│   ├── notifications/    # (Under Construction) Email logic
│   └── db/               # PostgreSQL models & schemas
└── COLLABORATOR_PROMPT.md # Handoff documentation
```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---
**Created with ❤️ by Riyaz & Team**