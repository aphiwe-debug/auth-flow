from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud, auth, models
from app.database import get_db
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserOut)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = crud.create_user(db, user_in)
    return user

@router.post("/login", response_model=schemas.Token)
def login(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.email)
    if not user or not crud.verify_user_password(user, form_data.password):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    access_token = auth.create_access_token({"sub": str(user.id)})
    refresh_token, jti, expires = auth.create_refresh_token({"sub": str(user.id)})
    rt = models.RefreshToken(user_id=user.id, jti=jti, expires_at=expires)
    db.add(rt)
    db.commit()
    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token}

@router.post("/refresh", response_model=schemas.Token)
def refresh_token(body: dict, db: Session = Depends(get_db)):
    refresh_token = body.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=400, detail="refresh_token required")
    try:
        payload = auth.decode_token(refresh_token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=400, detail="Not a refresh token")
    jti = payload.get("jti")
    token_row = db.query(models.RefreshToken).filter_by(jti=jti, revoked=False).first()
    if not token_row or token_row.expires_at < datetime.now(token_row.expires_at.tzinfo):
        raise HTTPException(status_code=401, detail="Refresh token revoked or expired")
    user_id = payload.get("sub")
    access_token = auth.create_access_token({"sub": user_id})
    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token}

@router.post("/logout")
def logout(body: dict, db: Session = Depends(get_db)):
    refresh_token = body.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=400, detail="refresh_token required")
    try:
        payload = auth.decode_token(refresh_token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    jti = payload.get("jti")
    token_row = db.query(models.RefreshToken).filter_by(jti=jti).first()
    if token_row:
        token_row.revoked = True
        db.add(token_row)
        db.commit()
    return {"msg": "logged out"}
