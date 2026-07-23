from fastapi import APIRouter, FastAPI
from . import product, products, review, users

router = APIRouter()

router.include_router(products.router)
router.include_router(product.router)
router.include_router(review.router)
router.include_router(users.router)

web_api = FastAPI()
web_api.include_router(router)