import random
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from app.database.models import Patient, Analysis
from app.schemas.patient import PatientCreate

def generate_patient_code(db: Session) -> str:
    count = db.query(Patient).count() + 1
    code = f"PAT-{count:04d}"
    # Ensure uniqueness
    while db.query(Patient).filter(Patient.patient_code == code).first() is not None:
        count += 1
        code = f"PAT-{count:04d}"
    return code

def create_patient(db: Session, patient_in: PatientCreate, user_id: int) -> Patient:
    patient_code = generate_patient_code(db)
    patient = Patient(
        patient_code=patient_code,
        name=patient_in.name,
        age=patient_in.age,
        gender=patient_in.gender or "Female",
        created_by=user_id
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

def get_user_patients(db: Session, user_id: int, search: Optional[str] = None) -> List[dict]:
    query = db.query(Patient).filter(Patient.created_by == user_id)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Patient.name.ilike(search_pattern)) | (Patient.patient_code.ilike(search_pattern))
        )
    patients = query.order_by(Patient.created_at.desc()).all()
    
    result = []
    for p in patients:
        count = db.query(Analysis).filter(Analysis.patient_id == p.id).count()
        result.append({
            "id": p.id,
            "patient_code": p.patient_code,
            "name": p.name,
            "age": p.age,
            "gender": p.gender,
            "created_by": p.created_by,
            "created_at": p.created_at,
            "analysis_count": count
        })
    return result

def get_patient_by_id(db: Session, patient_id: int, user_id: int) -> Patient:
    patient = db.query(Patient).filter(Patient.id == patient_id, Patient.created_by == user_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found or unauthorized"
        )
    return patient
