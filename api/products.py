from fastapi import APIRouter
from pydantic import BaseModel
from core.storage import create_new_product, get_products_list, get_products_reviews_list

router = APIRouter(prefix='/products', tags=["products"])

class CreateProductRequest(BaseModel):
    name: str
    sku: str
    category: str
    description: str

@router.post('')
async def api_create_new_review(payload: CreateProductRequest):
    return create_new_product(name=payload.name, sku=payload.sku, category=payload.category, description=payload.description)

@router.get('')
async def api_get_products_list():
    return await get_products_list()

@router.get('/{product_id}/reviews')
async def api_get_products_reviews_list(product_id):
    return await get_products_reviews_list(product_id)