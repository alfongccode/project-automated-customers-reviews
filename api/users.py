from fastapi import APIRouter
from pydantic import BaseModel
from core import test_user

router = APIRouter(prefix='/users', tags=["users"])

class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str

@router.post('/create')
def create_new_user(payload: CreateUserRequest):
    return test_user.create_new_user(username=payload.username, email=payload.email, password=payload.password)