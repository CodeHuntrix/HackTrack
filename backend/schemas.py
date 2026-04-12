from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class HackathonBase(BaseModel):
    title: str # Required
    platform: Optional[str] = None
    link: Optional[str] = None
    status: Optional[str] = "Upcoming"
    
    # Phase 3 Fields
    duration: Optional[str] = None
    fees: Optional[str] = None
    hackathon_type: Optional[str] = None
    is_direct_to_final: Optional[bool] = False
    
    # Milestone Dates
    registration_deadline: Optional[datetime] = None
    round_1_date: Optional[datetime] = None
    result_date: Optional[datetime] = None
    final_round_date: Optional[datetime] = None
    top_teams_date: Optional[datetime] = None
    grand_finale_date: Optional[datetime] = None
    
    # Details & Storage
    submission_deadline: Optional[datetime] = None
    mode: Optional[str] = None
    team_size: Optional[str] = None
    prize_pool: Optional[str] = None
    organization: Optional[str] = None
    round_1_criteria: Optional[str] = None
    extra_rounds: Optional[str] = None
    final_round: Optional[str] = None
    
    checklist: Optional[Dict[str, bool]] = {}
    extra_data: Optional[Dict[str, Any]] = {}

class HackathonCreate(HackathonBase):
    pass

class HackathonUpdate(HackathonBase):
    title: Optional[str] = None

class Hackathon(HackathonBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ExtractionRequest(BaseModel):
    raw_text: str

class TeamSettingsUpdate(BaseModel):
    member_emails: List[str]
