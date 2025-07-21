from datetime import timedelta, datetime, timezone
import logging
from typing import Annotated
from uuid import UUID, uuid4
from fastapi import Depends
from passlib.context import CryptContext
import jwt
from jwt import PyJWTError
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from src.entities.user import User, RefreshToken
from . import models
from ..exceptions import AuthenticationError
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
REFRESH_TOKEN_EXPIRE_MINUTES = int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES", "43200"))  # Default 30 days


oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def create_access_token(email: str, user_id: UUID, expires_delta: timedelta) -> str:
    encode = {
        'sub': email,
        'id': str(user_id),
        'exp': datetime.now(timezone.utc) + expires_delta
    }
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> models.TokenData:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get('id')
        return models.TokenData(user_id=user_id)
    except PyJWTError as e:
        logging.warning(f"Token verification failed: {str(e)}")
        raise AuthenticationError()
    
def register_user(db: Session, register_user_request: models.RegisterUserRequest) -> None:
    try:
        create_user_model = User(
            id = uuid4(),
            email = register_user_request.email,
            first_name=register_user_request.first_name,
            last_name=register_user_request.last_name,
            password_hash=get_password_hash(register_user_request.password)
        )
        db.add(create_user_model)
        db.commit()
    except Exception as e:
        logging.error(f"Failed to register user: {register_user_request.email}. Error: {str(e)}")
        raise

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt_context.verify(password, hashed_password)

def get_password_hash(password: str) -> str:
    return bcrypt_context.hash(password)

def authenticate_user(email:str, password:str, db:Session) -> User | bool:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        logging.warning(f"Failed authentication attempt for email: {email}")
        return False
    return user

def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]) -> models.TokenData:
    return verify_token(token)

CurrentUser = Annotated[models.TokenData, Depends(get_current_user)]

def create_refresh_token_db(db: Session, user: User) -> str:
    """
    Create a new refresh token, store it in DB, and remove any previous token for this user (single session).
    """
    from uuid import uuid4
    import secrets
    # Generate a secure random token string (not a JWT)
    token = secrets.token_urlsafe(64)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    # Remove any existing refresh token for this user
    db.query(RefreshToken).filter(RefreshToken.user_id == user.id).delete()
    db.commit()
    # Store new token
    refresh_token = RefreshToken(
        id=uuid4(),
        user_id=user.id,
        token=token,
        created_at=datetime.now(timezone.utc),
        expires_at=expires_at
    )
    db.add(refresh_token)
    db.commit()
    return token

def verify_refresh_token_db(db: Session, token: str) -> User:
    """
    Verify the refresh token exists, is not expired, and return the associated user.
    """
    refresh_token = db.query(RefreshToken).filter(RefreshToken.token == token).first()
    if not refresh_token:
        from src.exceptions import RefreshTokenError
        raise RefreshTokenError()
    if refresh_token.expires_at < datetime.now(timezone.utc):
        db.delete(refresh_token)
        db.commit()
        from src.exceptions import RefreshTokenError
        raise RefreshTokenError("Refresh token expired")
    user = db.query(User).filter(User.id == refresh_token.user_id).first()
    if not user:
        from src.exceptions import RefreshTokenError
        raise RefreshTokenError("User not found for refresh token")
    return user

def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session) -> models.Token:
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise AuthenticationError()
    access_token = create_access_token(user.email, user.id, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    refresh_token = create_refresh_token_db(db, user)
    return models.Token(access_token=access_token, token_type='bearer', refresh_token=refresh_token)

def refresh_access_token(refresh_token: str, db: Session) -> models.Token:
    user = verify_refresh_token_db(db, refresh_token)
    # Remove the old refresh token (single session)
    db.query(RefreshToken).filter(RefreshToken.user_id == user.id).delete()
    db.commit()
    access_token = create_access_token(user.email, user.id, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    new_refresh_token = create_refresh_token_db(db, user)
    return models.Token(access_token=access_token, token_type='bearer', refresh_token=new_refresh_token)

def logout_user(current_user: models.TokenData, db: Session):
    user_id = current_user.get_uuid()
    if user_id:
        db.query(RefreshToken).filter(RefreshToken.user_id == user_id).delete()
        db.commit()


