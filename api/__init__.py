from fastapi import APIRouter, FastAPI
from . import review, users

router = APIRouter()

router.include_router(review.router)
router.include_router(users.router)

web_api = FastAPI()
web_api.include_router(router)