from fastapi import APIRouter
from pydantic import BaseModel
from fastapi_pagination import Page, paginate
from core.main import create_new_product, get_products_list, get_product, get_product_most_hated, get_product_most_loved, get_products_reviews_list, summarize_product_reviews

router = APIRouter(prefix='/products', tags=["products"])

class CreateProductRequest(BaseModel):
    brand: str
    name: str
    sku: str
    tags: str
    description: str

@router.post('')
async def api_create_new_product(payload: CreateProductRequest):
    return await create_new_product(brand=payload.brand, name=payload.name, sku=payload.sku, tags=payload.tags, description=payload.description)

@router.get('', response_model=Page[dict])
async def api_get_products_list(prefix = "", sort_by = ""):
    products_list = await get_products_list(prefix=prefix, sort_by= sort_by)
    return paginate(products_list)

@router.get('/most_hated')
async def api_get_product_most_hated():
    return await get_product_most_hated()

@router.get('/most_loved')
async def api_get_product_most_loved():
    return await get_product_most_loved()

@router.get('/{product_id}')
async def api_get_product(product_id):
    return await get_product(product_id)

@router.get('/{product_id}/reviews', response_model=Page[dict])
async def api_get_products_reviews_list(product_id):
    products_reviews_list = await get_products_reviews_list(product_id)
    return paginate(products_reviews_list)

@router.get('/{product_id}/reviews/summarize')
async def api_summarize_product_reviews(product_id):
    return await summarize_product_reviews(product_id)