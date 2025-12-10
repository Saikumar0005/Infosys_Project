import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from backend.app.schemas.user_schema import LoginRequest, LoginResponse, SignupRequest, SignupResponse
from app.utils.jwt_handler import create_access_token, create_refresh_token
from app.utils.hash_password import verify_password, hash_password
from app.database import get_db
from app.models.user_model import User

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Auth"])

@router.post("/signup")
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == payload.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists with this email")
        
        # Hash password
        hashed_password = hash_password(payload.password)
        
        # Create new user
        new_user = User(
            name=payload.name,
            email=payload.email,
            password=hashed_password
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        logger.info(f"New user created: {new_user.id}")
        return {"message": "User created successfully", "user_id": new_user.id}
        
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error during signup: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        logger.error(f"Unexpected error during signup: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == payload.email).first()
        
        # Always verify password to prevent timing attacks
        dummy_hash = "$2b$12$dummy.hash.to.prevent.timing.attacks"
        password_hash = user.password if user else dummy_hash
        is_valid = verify_password(payload.password, password_hash)
        
        if not user or not is_valid:
            logger.warning("Failed login attempt")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        access_token = create_access_token({"user_id": user.id})
        refresh_token = create_refresh_token({"user_id": user.id})
        
        if not access_token or not refresh_token:
            logger.error(f"Token creation failed for user: {user.id}")
            raise HTTPException(status_code=500, detail="Authentication service error")
        
        logger.info(f"Successful login for user: {user.id}")
        return {"message": "Login successful", "access_token": access_token, "refresh_token": refresh_token}
        
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        logger.error(f"Database error during login: {str(e)}")
        raise HTTPException(status_code=500, detail="Database service error")
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
