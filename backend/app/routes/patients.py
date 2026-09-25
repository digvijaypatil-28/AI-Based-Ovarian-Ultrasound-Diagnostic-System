from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.database import get_db
from app.database.models import User
from app.schemas.patient import PatientCreate, PatientResponse
from app.schemas.analysis import AnalysisResponse
from app.services.patient_service import create_patient, get_user_patients, get_patient_by_id
from app.services.analysis_service import get_patient_analyses
from app.routes.auth import get_current_user

router = APIRouter(prefix="/patients", tags=["Patient Management"])

@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def add_patient(
    patient_in: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a new patient record associated with the authenticated clinician."""
    patient = create_patient(db, patient_in, user_id=current_user.id)
    return {
        "id": patient.id,
        "patient_code": patient.patient_code,
        "name": patient.name,
        "age": patient.age,
        "gender": patient.gender,
        "created_by": patient.created_by,
        "created_at": patient.created_at,
        "analysis_count": 0
    }

@router.get("", response_model=List[PatientResponse])
def list_patients(
    search: Optional[str] = Query(None, description="Search by patient name or code"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all patients registered by the current user."""
    return get_user_patients(db, user_id=current_user.id, search=search)

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get single patient profile by ID."""
    patient = get_patient_by_id(db, patient_id, user_id=current_user.id)
    analysis_count = len(patient.analyses)
    return {
        "id": patient.id,
        "patient_code": patient.patient_code,
        "name": patient.name,
        "age": patient.age,
        "gender": patient.gender,
        "created_by": patient.created_by,
        "created_at": patient.created_at,
        "analysis_count": analysis_count
    }

@router.get("/{patient_id}/analyses", response_model=List[AnalysisResponse])
def list_patient_analyses(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all ultrasound analysis records for a specific patient."""
    return get_patient_analyses(db, patient_id=patient_id, user_id=current_user.id)
