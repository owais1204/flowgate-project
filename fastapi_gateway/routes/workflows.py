from fastapi import APIRouter

from services.spring_client import (
    forward_get,
    forward_post,
    forward_put
)

router = APIRouter()


# =====================================
# GET ALL WORKFLOWS
# =====================================

@router.get("/workflows")
def get_workflows():

    return forward_get("/api/workflows")


# =====================================
# DASHBOARD
# =====================================

@router.get("/workflows/dashboard")
def dashboard():

    return forward_get("/api/workflows/dashboard")


# =====================================
# MANAGER QUEUE
# =====================================

@router.get("/workflows/manager")
def manager():

    return forward_get("/api/workflows/manager")


# =====================================
# ADMIN QUEUE
# =====================================

@router.get("/workflows/admin")
def admin():

    return forward_get("/api/workflows/admin")


# =====================================
# CREATE WORKFLOW
# =====================================

@router.post("/workflows")
def create_workflow(data: dict):

    return forward_post(
        "/api/workflows",
        data
    )


# =====================================
# APPROVE WORKFLOW
# =====================================

@router.put("/workflows/{id}/approve")
def approve(id: int):

    return forward_put(
        f"/api/workflows/{id}/approve"
    )


# =====================================
# REJECT WORKFLOW
# =====================================

@router.put("/workflows/{id}/reject")
def reject(id: int):

    return forward_put(
        f"/api/workflows/{id}/reject"
    )


# =====================================
# MANAGER APPROVE
# =====================================

@router.put("/workflows/{id}/manager-approve")
def manager_approve(id: int):

    return forward_put(
        f"/api/workflows/{id}/manager-approve"
    )


# =====================================
# WORKFLOW HISTORY
# =====================================

@router.get("/workflows/{id}/history")
def history(id: int):

    return forward_get(
        f"/api/workflows/{id}/history"
    )


# =====================================
# SEARCH WORKFLOW
# =====================================

@router.get("/workflows/search")
def search(q: str):

    return forward_get(
        f"/api/workflows/search?q={q}"
    )


# =====================================
# GET ALL USERS / APPROVERS
# =====================================

@router.get("/users")
def get_users():

    return forward_get("/api/users")