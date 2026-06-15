from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.workflows import router as workflow_router
from routes.auth import router as auth_router

from middleware.logger import LoggingMiddleware

app = FastAPI(
    title="FlowGate Gateway",
    version="1.0"
)

# CORS MIDDLEWARE
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
        "http://127.0.0.1:3004",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LOGGER MIDDLEWARE
app.add_middleware(LoggingMiddleware)

# WORKFLOW ROUTES
app.include_router(
    workflow_router,
    prefix="/api"
)

# AUTH ROUTES
app.include_router(
    auth_router,
    prefix="/api"
)

# HOME
@app.get("/")
def home():
    return {
        "service": "FlowGate Gateway",
        "status": "running"
    }