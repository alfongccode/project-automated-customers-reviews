from fastapi import APIRouter
from pydantic import BaseModel
from core.main import predict_review_classification
from core.storage import create_new_product

router = APIRouter(prefix='/product', tags=["product"])

class CreateProductRequest(BaseModel):
    name: str
    sku: str
    category: str
    description: str

@router.post('/create')
async def api_create_new_product(payload: CreateProductRequest):
    return create_new_product(name=payload.name, sku=payload.sku, category=payload.category, description=payload.description)