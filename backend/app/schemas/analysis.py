from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Dict, Optional

class AnalysisResponse(BaseModel):
    analysis_id: int
    patient_id: int
    patient_name: Optional[str] = None
    patient_code: Optional[str] = None
    prediction: str
    confidence: float
    probabilities: Dict[str, float]
    original_image_url: str
    gradcam_image_url: str
    report_path: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
