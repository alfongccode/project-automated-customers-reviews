from fastapi import APIRouter
from pydantic import BaseModel
from core.main import get_review_sentiment
from core.storage import create_new_review, get_reviews_list

router = APIRouter(prefix='/reviews', tags=["reviews"])

class CreateReviewRequest(BaseModel):
    username: str
    product_id: int
    title: str
    content: str
    rating: int

@router.post('')
async def api_create_new_review(payload: CreateReviewRequest):
    return await create_new_review(username=payload.username, product_id=payload.product_id, title=payload.title, content=payload.content, rating=payload.rating)

@router.get('')
async def api_create_new_review():
    return await get_reviews_list()

@router.get('/{review_id}/sentiment')
async def api_get_review_sentiment(review_id):
    return await get_review_sentiment(review_id)