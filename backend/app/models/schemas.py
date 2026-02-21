from pydantic import BaseModel, Field
from typing import List

class AuditRequest(BaseModel):
    projectName: str
    elevatorPitch: str
    assumptions: List[str]
    monthlyBurn: float
    targetCAC: float

class AuditResponse(BaseModel):
    fragilityScore: float
    riskLevel: str
    recommendation: str
    chartData: List[int]