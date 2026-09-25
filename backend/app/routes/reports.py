import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User, Analysis, Patient
from app.services.report_service import generate_pdf_report
from app.routes.auth import get_current_user
from app.core.config import settings

router = APIRouter(prefix="/reports", tags=["Report Generation"])

@router.get("/{analysis_id}/pdf")
def download_pdf_report(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns the generated PDF report for a given analysis ID.
    Generates report on-the-fly if missing.
    """
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis report not found or unauthorized access"
        )

    patient = db.query(Patient).filter(Patient.id == analysis.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated patient record not found"
        )

    base_backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

    pdf_rel_path = analysis.report_path
    if pdf_rel_path:
        pdf_abs_path = os.path.join(base_backend_dir, pdf_rel_path.replace("/", os.sep))
    else:
        pdf_abs_path = None

    if not pdf_abs_path or not os.path.exists(pdf_abs_path):
        # Generate PDF report
        rel_path = generate_pdf_report(analysis, patient, current_user, output_dir=settings.REPORT_DIR)
        analysis.report_path = rel_path
        db.commit()
        db.refresh(analysis)
        pdf_abs_path = os.path.join(base_backend_dir, rel_path.replace("/", os.sep))

    filename = f"Ovarian_Analysis_Report_PAT_{patient.patient_code}_{analysis.id}.pdf"

    return FileResponse(
        path=pdf_abs_path,
        media_type="application/pdf",
        filename=filename,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
