# Collaborative Handoff: Email Reminder Module

This document is designed for the collaborator's Antigravity AI to understand exactly how to implement the email system for HackTrack.

## System Context
The base HackTrack app is built with **FastAPI** (Backend) and **React** (Frontend).
The backend uses **SQLAlchemy** with **PostgreSQL** (for Render deployment).

## Your Task
Implement a scheduled email reminder system with 7 milestones:
1.  **30 Days**: Ideation Start.
2.  **14 Days**: Research Phase.
3.  **7 Days**: PPT Start.
4.  **3 Days**: Refinement.
5.  **2 Days**: Finalization.
6.  **24 Hours**: Submission Eve.
7.  **Deadline Hour**: Final Call.

## Module Location
- Service logic: `backend/notifications/scheduler.py`
- HTML Templates: `backend/notifications/email_templates.py`

## Technical Requirements
- Use **APScheduler** to manage the jobs.
- Use **Resend** (python client) for email delivery.
- Fetch member emails from the `TeamSettings` table (or via the `/settings` endpoint).
- Calculate offsets based on the `submission_deadline` of each hackathon.
- Ensure that when a hackathon is updated or deleted, the corresponding jobs are updated/removed.

## Integration Hook
In `backend/main.py`, you should add a background life-cycle hook to start the scheduler on app startup.

```python
# Use the lifespan event in FastAPI
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the scheduler here
    yield
    # Shutdown the scheduler here
```
