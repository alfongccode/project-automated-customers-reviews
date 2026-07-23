from fastapi import APIRouter
from asgiref.sync import sync_to_async
from core.storage import get_products_list

router = APIRouter(prefix='/products', tags=["products"])

@router.get('')
async def api_get_products_list():
    return await get_products_list()