import requests
from config import SPRING_URL


def forward_get(path):

    response = requests.get(
        f"{SPRING_URL}{path}"
    )

    return response.json()


def forward_post(path, data):

    response = requests.post(
        f"{SPRING_URL}{path}",
        json=data
    )

    return response.json()


def forward_put(path):

    response = requests.put(
        f"{SPRING_URL}{path}"
    )

    return response.json()