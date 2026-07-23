from fastapi import APIRouter
from pydantic import BaseModel
from core.storage import create_new_product, get_products_list, get_product, get_products_reviews_list, summarize_product_reviews

router = APIRouter(prefix='/products', tags=["products"])

class CreateProductRequest(BaseModel):
    name: str
    sku: str
    tags: str
    description: str

@router.post('')
async def api_create_new_product(payload: CreateProductRequest):
    return await create_new_product(name=payload.name, sku=payload.sku, tags=payload.tags, description=payload.description)

@router.get('')
async def api_get_products_list():
    return await get_products_list()

@router.get('/{product_id}')
async def api_get_product(product_id):
    return await get_product(product_id)

@router.get('/{product_id}/reviews')
async def api_get_products_reviews_list(product_id):
    return await get_products_reviews_list(product_id)

@router.get('/{product_id}/reviews/summarize')
async def api_summarize_product_reviews(product_id):
    return await summarize_product_reviews(product_id)