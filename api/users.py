from fastapi import APIRouter
from pydantic import BaseModel
from core.storage import create_new_user, get_users_list, get_user_reviews_list

router = APIRouter(prefix='/users', tags=["users"])

class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str

@router.post('')
async def api_create_new_user(payload: CreateUserRequest):
    return await create_new_user(username=payload.username, email=payload.email, password=payload.password)

@router.get('')
async def api_get_users_list():
    return await get_users_list()

@router.get('/{user_id}/reviews')
async def api_get_user_reviews_list(user_id):
    return await get_user_reviews_list(user_id)