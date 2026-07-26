from fastapi import APIRouter
from pydantic import BaseModel
from fastapi_pagination import Page, paginate
from core.main import create_new_user, get_user, get_users_list, get_user_reviews_list

router = APIRouter(prefix='/users', tags=["users"])

class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str

@router.post('')
async def api_create_new_user(payload: CreateUserRequest):
    return await create_new_user(username=payload.username, email=payload.email, password=payload.password)

@router.get('', response_model=Page[dict])
async def api_get_users_list():
    users_list = await get_users_list()
    return paginate(users_list)

@router.get('/{user_id}')
async def api_get_user(user_id):
    return await get_user(user_id)

@router.get('/{user_id}/reviews')
async def api_get_user_reviews_list(user_id):
    return await get_user_reviews_list(user_id)