from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean
from database import Base
import datetime

class Hackathon(Base):
    __tablename__ = "hackathons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True) 
    platform = Column(String, nullable=True)
    link = Column(String, nullable=True)
    
    # Status: Upcoming, Live, Ended, Submitted, Selected, Rejected
    status = Column(String, default="Upcoming")
    
    # Logistics
    duration = Column(String, nullable=True) # Now stored as numeric string e.g. "6"
    fees = Column(String, nullable=True) 
    hackathon_type = Column(String, nullable=True) 
    is_direct_to_final = Column(Boolean, default=False)
    
    # Milestone Dates 
    registration_deadline = Column(DateTime, nullable=True)
    round_1_date = Column(DateTime, nullable=True)
    result_date = Column(DateTime, nullable=True) 
    final_round_date = Column(DateTime, nullable=True) # RENAMED from final_submission_date
    top_teams_date = Column(DateTime, nullable=True)
    grand_finale_date = Column(DateTime, nullable=True)
    
    # Details & Storage
    submission_deadline = Column(DateTime, nullable=True) 
    mode = Column(String, nullable=True) 
    team_size = Column(String, nullable=True)
    prize_pool = Column(String, nullable=True)
    organization = Column(String, nullable=True)
    round_1_criteria = Column(String, nullable=True)
    extra_rounds = Column(String, nullable=True)
    final_round = Column(String, nullable=True)
    
    checklist = Column(JSON, default=dict)
    extra_data = Column(JSON, default=dict)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class TeamSettings(Base):
    __tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    member_emails = Column(JSON, default=list)
