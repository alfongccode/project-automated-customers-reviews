import os
import django
 
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()
 
from fastapi import APIRouter, FastAPI
from fastapi_pagination import add_pagination
from . import products, reviews, users
 
router = APIRouter()
 
router.include_router(products.router)
router.include_router(reviews.router)
router.include_router(users.router)
 
web_api = FastAPI()
web_api.include_router(router)
add_pagination(web_api)