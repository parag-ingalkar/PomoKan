from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database.core import engine, Base
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGIN,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


register_routes(app)