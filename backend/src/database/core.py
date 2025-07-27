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
                        pool_recycle=300,        # Recycle connections every 5 minutes (300 seconds)
                        pool_timeout=20,         # Timeout for getting connection from pool
                        max_overflow=0,          # Don't allow pool to overflow
                        echo=False,              # Set to True for debugging SQL queries
                        connect_args={
                            "sslmode": "require",  # Ensure SSL connection to Neon
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

