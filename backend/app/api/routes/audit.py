from fastapi import APIRouter
from app.models.schemas import AuditRequest, AuditResponse

router = APIRouter()

@router.post("/audit", response_model=AuditResponse)
async def run_audit(data: AuditRequest):
    # This is a temporary mock response until we connect the AI
    return {
        "fragilityScore": 4.5,
        "riskLevel": "Medium",
        "recommendation": "Initial logic check passed. Simulation pending.",
        "chartData": [10, 20, 35, 50, 45, 60]
    }