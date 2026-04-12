from sqlalchemy import Column, Integer, String, DateTime, JSON
from database import Base
import datetime

class Hackathon(Base):
    __tablename__ = "hackathons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    platform = Column(String)
    
    # Status: Upcoming, Live, Ended, Submitted, Selected, Rejected
    status = Column(String, default="Upcoming")
    
    # Main Dates
    registration_deadline = Column(DateTime, nullable=True)
    submission_deadline = Column(DateTime, nullable=True)
    
    # Core Details
    mode = Column(String) # Online, Offline, Hybrid
    team_size = Column(String)
    fee = Column(String)
    prize_pool = Column(String)
    organization = Column(String)
    
    # Round Info
    round_1_type = Column(String)
    round_1_criteria = Column(String)
    extra_rounds = Column(String) # Details for Round 2, 3, etc.
    final_round = Column(String)
    
    # Checklist (Stored as JSON)
    # e.g., {"PPT": true, "Video": false, "Code": false}
    checklist = Column(JSON, default=dict)
    
    # The "Noise" Drawer (Stored as JSON)
    extra_data = Column(JSON, default=dict)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class TeamSettings(Base):
    __tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    # JSON list of 4 emails
    member_emails = Column(JSON, default=list)
