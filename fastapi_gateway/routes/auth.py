from fastapi import APIRouter
from services.auth_client import (
    login_user,
    register_user
)

router = APIRouter()

@router.post("/auth/login")
def login(data: dict):

    return login_user(data)

@router.post("/auth/register")
def register(data: dict):

    return register_user(data)