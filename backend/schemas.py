from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class HackathonBase(BaseModel):
    title: str
    platform: Optional[str] = None
    status: Optional[str] = "Upcoming"
    registration_deadline: Optional[datetime] = None
    submission_deadline: Optional[datetime] = None
    mode: Optional[str] = None
    team_size: Optional[str] = None
    fee: Optional[str] = None
    prize_pool: Optional[str] = None
    organization: Optional[str] = None
    round_1_type: Optional[str] = None
    round_1_criteria: Optional[str] = None
    extra_rounds: Optional[str] = None
    final_round: Optional[str] = None
    checklist: Dict[str, bool] = {}
    extra_data: Dict = {}

class HackathonCreate(HackathonBase):
    pass

class HackathonUpdate(BaseModel):
    title: Optional[str] = None
    platform: Optional[str] = None
    status: Optional[str] = None
    registration_deadline: Optional[datetime] = None
    submission_deadline: Optional[datetime] = None
    mode: Optional[str] = None
    team_size: Optional[str] = None
    fee: Optional[str] = None
    prize_pool: Optional[str] = None
    organization: Optional[str] = None
    round_1_type: Optional[str] = None
    round_1_criteria: Optional[str] = None
    extra_rounds: Optional[str] = None
    final_round: Optional[str] = None
    checklist: Optional[Dict[str, bool]] = None
    extra_data: Optional[Dict] = None
    
class Hackathon(HackathonBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ExtractionRequest(BaseModel):
    raw_text: str

class TeamSettingsUpdate(BaseModel):
    member_emails: List[str]
