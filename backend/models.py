from sqlalchemy import Column, Integer, String, DateTime, JSON
from database import Base
import datetime

class Hackathon(Base):
    __tablename__ = "hackathons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True) # The ONLY required field
    platform = Column(String, nullable=True)
    link = Column(String, nullable=True)
    
    # Status: Upcoming, Live, Ended, Submitted, Selected, Rejected
    status = Column(String, default="Upcoming")
    
    # Milestone Dates (Centric to the new vision)
    registration_deadline = Column(DateTime, nullable=True)
    round_1_date = Column(DateTime, nullable=True)
    result_date = Column(DateTime, nullable=True) # Round 1 Result
    final_submission_date = Column(DateTime, nullable=True)
    top_teams_date = Column(DateTime, nullable=True) # Finalist Announcement
    grand_finale_date = Column(DateTime, nullable=True)
    
    # Legacy / Additional Info
    submission_deadline = Column(DateTime, nullable=True) # General fallback
    mode = Column(String, nullable=True) # Online, Offline, Hybrid
    team_size = Column(String, nullable=True)
    fee = Column(String, nullable=True)
    prize_pool = Column(String, nullable=True)
    organization = Column(String, nullable=True)
    
    # Criteria & Notes
    round_1_type = Column(String, nullable=True)
    round_1_criteria = Column(String, nullable=True)
    extra_rounds = Column(String, nullable=True) # General notes for other rounds
    final_round = Column(String, nullable=True)
    
    # Storage
    checklist = Column(JSON, default=dict)
    extra_data = Column(JSON, default=dict)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class TeamSettings(Base):
    __tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    member_emails = Column(JSON, default=list)
