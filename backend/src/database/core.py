from typing import Annotated
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base
import os
from dotenv import load_dotenv
# from src.entities.user import User, RefreshToken

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL,
                        pool_pre_ping=True,      # Test connections before using them
                        pool_recycle=240,        # Recycle connections every 4 minutes (240 seconds) - before Neon auto-pause
                        pool_timeout=30,         # Timeout for getting connection from pool
                        max_overflow=10,         # Allow more overflow connections for better handling
                        pool_size=3,             # Smaller base pool size for serverless
                        echo=False,              # Set to True for debugging SQL queries
                        connect_args={
                            "sslmode": "require",  # Ensure SSL connection to Neon
                            "connect_timeout": 10,  # Connection timeout
                            "application_name": "pomokan_backend",  # For monitoring
                        })

SessionLocal = sessionmaker(autocommit = False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

DbSession = Annotated[Session, Depends(get_db)]

