import os
import json
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
from typing import List, Dict, Any, Optional
from app.database.models import Analysis, Patient, User
from app.ai.predictor import predict_ultrasound
from app.ai.gradcam import generate_and_save_gradcam
from app.services.report_service import generate_pdf_report
from app.core.config import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE = 15 * 1024 * 1024  # 15 MB

def validate_image_file(file: UploadFile):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension '{ext}'. Only JPG, JPEG, and PNG images are allowed."
        )

def process_and_create_analysis(
    db: Session,
    patient_id: int,
    file: UploadFile,
    user: User
) -> Dict[str, Any]:
    # 1. Validate patient belongs to current user
    patient = db.query(Patient).filter(Patient.id == patient_id, Patient.created_by == user.id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found or unauthorized access."
        )

    # 2. Validate file type
    validate_image_file(file)

    # 3. Read image contents
    image_bytes = file.file.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum allowed limit of 15MB."
        )

    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    # 4. Run PyTorch model inference
    try:
        pred_dict, tensor_batch, pil_img = predict_ultrasound(image_bytes)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing ResNet18 model inference: {str(e)}"
        )

    # 5. Generate Grad-CAM visualization
    try:
        orig_rel_path, gradcam_rel_path = generate_and_save_gradcam(
            input_tensor=tensor_batch,
            pil_image=pil_img,
            upload_dir=settings.UPLOAD_DIR
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating Grad-CAM explainability overlay: {str(e)}"
        )

    # 6. Create Analysis record in DB
    analysis = Analysis(
        patient_id=patient.id,
        user_id=user.id,
        image_path=orig_rel_path,
        predicted_class=pred_dict["prediction"],
        confidence=pred_dict["confidence"],
        probabilities=json.dumps(pred_dict["probabilities"]),
        gradcam_path=gradcam_rel_path,
        report_path=None
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    # 7. Generate PDF report
    try:
        pdf_path = generate_pdf_report(analysis, patient, user, output_dir=settings.REPORT_DIR)
        analysis.report_path = pdf_path
        db.commit()
        db.refresh(analysis)
    except Exception as e:
        print(f"[!] Warning: PDF generation failed for analysis ID {analysis.id}: {e}")

    return format_analysis_response(analysis, patient)

def format_analysis_response(analysis: Analysis, patient: Optional[Patient] = None) -> Dict[str, Any]:
    probs = json.loads(analysis.probabilities) if isinstance(analysis.probabilities, str) else analysis.probabilities
    
    patient_name = patient.name if patient else (analysis.patient.name if analysis.patient else "")
    patient_code = patient.patient_code if patient else (analysis.patient.patient_code if analysis.patient else "")

    return {
        "analysis_id": analysis.id,
        "patient_id": analysis.patient_id,
        "patient_name": patient_name,
        "patient_code": patient_code,
        "prediction": analysis.predicted_class,
        "confidence": analysis.confidence,
        "probabilities": probs,
        "original_image_url": f"/{analysis.image_path.replace(os.sep, '/')}",
        "gradcam_image_url": f"/{analysis.gradcam_path.replace(os.sep, '/')}",
        "report_path": f"/{analysis.report_path.replace(os.sep, '/')}" if analysis.report_path else None,
        "created_at": analysis.created_at
    }

def get_user_analyses(db: Session, user_id: int) -> List[Dict[str, Any]]:
    analyses = db.query(Analysis).filter(Analysis.user_id == user_id).order_by(Analysis.created_at.desc()).all()
    return [format_analysis_response(a) for a in analyses]

def get_patient_analyses(db: Session, patient_id: int, user_id: int) -> List[Dict[str, Any]]:
    patient = db.query(Patient).filter(Patient.id == patient_id, Patient.created_by == user_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    analyses = db.query(Analysis).filter(Analysis.patient_id == patient_id).order_by(Analysis.created_at.desc()).all()
    return [format_analysis_response(a, patient) for a in analyses]

def get_analysis_by_id(db: Session, analysis_id: int, user_id: int) -> Dict[str, Any]:
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == user_id).first()
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found or unauthorized access"
        )
    return format_analysis_response(analysis)
