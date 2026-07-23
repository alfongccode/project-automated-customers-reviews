from fastapi import APIRouter, FastAPI
from . import products, reviews, users

router = APIRouter()

router.include_router(products.router)
router.include_router(reviews.router)
router.include_router(users.router)

web_api = FastAPI()
web_api.include_router(router)