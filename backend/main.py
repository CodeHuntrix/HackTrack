from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

import models
import schemas
import database
from services import groq_service

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="HackTrack API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Hackathon Endpoints ---

@app.get("/hackathons", response_model=List[schemas.Hackathon])
def list_hackathons(db: Session = Depends(database.get_db)):
    return db.query(models.Hackathon).all()

@app.post("/hackathons", response_model=schemas.Hackathon)
def create_hackathon(hackathon: schemas.HackathonCreate, db: Session = Depends(database.get_db)):
    db_hackathon = models.Hackathon(**hackathon.dict())
    db.add(db_hackathon)
    db.commit()
    db.refresh(db_hackathon)
    return db_hackathon

@app.put("/hackathons/{hackathon_id}", response_model=schemas.Hackathon)
def update_hackathon(hackathon_id: int, hackathon: schemas.HackathonUpdate, db: Session = Depends(database.get_db)):
    db_hackathon = db.query(models.Hackathon).filter(models.Hackathon.id == hackathon_id).first()
    if not db_hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")
    
    update_data = hackathon.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_hackathon, key, value)
    
    db.commit()
    db.refresh(db_hackathon)
    return db_hackathon

@app.delete("/hackathons/{hackathon_id}")
def delete_hackathon(hackathon_id: int, db: Session = Depends(database.get_db)):
    db_hackathon = db.query(models.Hackathon).filter(models.Hackathon.id == hackathon_id).first()
    if not db_hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")
    
    db.delete(db_hackathon)
    db.commit()
    return {"message": "Deleted successfully"}

# --- AI Extraction Endpoint ---

@app.post("/extract")
def extract_data(request: schemas.ExtractionRequest):
    try:
        data = groq_service.extract_hackathon_data(request.raw_text)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Team Settings ---

@app.get("/settings", response_model=schemas.TeamSettingsUpdate)
def get_settings(db: Session = Depends(database.get_db)):
    settings = db.query(models.TeamSettings).first()
    if not settings:
        return {"member_emails": []}
    return settings

@app.post("/settings", response_model=schemas.TeamSettingsUpdate)
def update_settings(settings: schemas.TeamSettingsUpdate, db: Session = Depends(database.get_db)):
    db_settings = db.query(models.TeamSettings).first()
    if not db_settings:
        db_settings = models.TeamSettings(member_emails=settings.member_emails)
        db.add(db_settings)
    else:
        db_settings.member_emails = settings.member_emails
    
    db.commit()
    db.refresh(db_settings)
    return db_settings
