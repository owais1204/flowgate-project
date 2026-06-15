import requests
from config import SPRING_URL

def login_user(data):

    response = requests.post(
        f"{SPRING_URL}/api/auth/login",
        json=data
    )

    return response.json()

def register_user(data):

    response = requests.post(
        f"{SPRING_URL}/api/auth/register",
        json=data
    )

    return response.json()