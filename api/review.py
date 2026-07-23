from fastapi import APIRouter
from pydantic import BaseModel
from core.main import predict_review_classification
from core.storage import create_new_review

router = APIRouter(prefix='/review', tags=["review"])

class CreateReviewRequest(BaseModel):
    title: str
    content: str
    rating: int

@router.get("/classify")
async def get_review_classification():
    return predict_review_classification()

@router.post('/create')
async def api_create_new_review(payload: CreateReviewRequest):
    return create_new_review(title=payload.title, content=payload.content, rating=payload.rating)