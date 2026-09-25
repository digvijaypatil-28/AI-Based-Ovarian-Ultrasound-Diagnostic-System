from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.database.models import User
from app.schemas.analysis import AnalysisResponse
from app.services.analysis_service import (
    process_and_create_analysis, get_user_analyses, get_analysis_by_id
)
from app.routes.auth import get_current_user

router = APIRouter(prefix="/analysis", tags=["AI Analysis"])

@router.post("/analyze", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
def run_analysis(
    patient_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Executes AI prediction pipeline using ResNet18 model and generates Grad-CAM explainability.
    Saves analysis result & report in database.
    """
    return process_and_create_analysis(db, patient_id=patient_id, file=file, user=current_user)

@router.get("/history", response_model=List[AnalysisResponse])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve full analysis history for current user."""
    return get_user_analyses(db, user_id=current_user.id)

@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis_details(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve detailed analysis result by analysis ID."""
    return get_analysis_by_id(db, analysis_id=analysis_id, user_id=current_user.id)
