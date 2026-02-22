from fastapi import APIRouter, HTTPException
from app.models.schemas import AuditRequest, AuditResponse
from app.services.harmonizer_service import HarmonizerService
from app.services.model_service import ModelService
from app.core.logging import get_logger

router = APIRouter()

logger = get_logger(__name__)

harmonizer = HarmonizerService()
model_service = ModelService(model_path="research/data/processed/xgb_model.json")


@router.post("/audit", response_model=AuditResponse)
async def run_audit(data: AuditRequest):
    """
    Runs full fragility audit for startup idea.
    """

    try:
        logger.info(f"Audit request received for: {data.projectName}")

        # Step 1 — Build feature dictionary from input
        features = harmonizer.build_features_from_input(data)

        # Step 2 — Run ML prediction
        prediction_result = model_service.predict(features)

        # Step 3 — Map ML output to your schema
        response = AuditResponse(
            fragilityScore=prediction_result["viability_score"],
            riskLevel=prediction_result["confidence"],
            recommendation="Model-driven fragility assessment complete.",
            chartData=[10, 25, 40, 55, 70, int(prediction_result["viability_score"] * 100)]
        )

        logger.info(f"Audit completed for: {data.projectName}")

        return response

    except Exception as e:
        logger.error(f"Audit failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Audit process failed.")