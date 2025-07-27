from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .database.core import engine, Base, get_db
from .entities.todo import Todo
from .entities.user import User
from .api import register_routes
from .logging import configure_logging, LogLevels
from dotenv import load_dotenv
import os

load_dotenv()
configure_logging(LogLevels.info)

CORS_ORIGIN = os.getenv("CORS_ORIGIN")

app = FastAPI()

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.get("/health/db")
def database_health_check():
    """Check database connectivity - useful for warming up Neon DB"""
    try:
        db = next(get_db())
        # Simple query to test connection
        db.execute("SELECT 1")
        db.close()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database unavailable: {str(e)}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGIN,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


register_routes(app)