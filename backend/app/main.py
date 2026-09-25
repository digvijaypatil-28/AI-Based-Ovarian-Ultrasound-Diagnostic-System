import os
import sys
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Add backend folder to Python sys.path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app.core.config import settings
from app.database.database import engine, Base
from app.database import models  # Register models
from app.ai.model_loader import ModelContainer
from app.routes import auth, patients, analysis, reports

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Based Ovarian Ultrasound Diagnostic System",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*"  # Development environment fallback
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists and mount static files
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
upload_abs_path = os.path.join(backend_dir, "uploads")
os.makedirs(upload_abs_path, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_abs_path), name="uploads")

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(patients.router, prefix=settings.API_V1_STR)
app.include_router(analysis.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    """Initialize AI model loader on server startup."""
    try:
        container = ModelContainer.get_instance()
        container.load_model()
        print("[+] ResNet18 AI model successfully initialized on startup.")
    except Exception as e:
        print(f"[!] Warning: Initial model loading deferred or failed: {e}")

@app.get("/api/health", tags=["Health Check"])
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler to avoid exposing raw stack traces."""
    print(f"[ERROR] Global Unhandled Exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred while processing your request."}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
