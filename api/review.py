from fastapi import APIRouter
from core.main import predict_review_classification

router = APIRouter(prefix='/review', tags=["review"])

@router.get("/classify")
async def get_review_classification():
    return predict_review_classification()
