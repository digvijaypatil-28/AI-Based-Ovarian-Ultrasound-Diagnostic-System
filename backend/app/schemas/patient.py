from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List

class PatientCreate(BaseModel):
    name: str
    age: int
    gender: Optional[str] = "Female"

class PatientResponse(BaseModel):
    id: int
    patient_code: str
    name: str
    age: int
    gender: str
    created_by: int
    created_at: datetime
    analysis_count: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)
