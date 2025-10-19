from sqlalchemy import select
from app import models
from app.auth import get_password_hash, verify_password

def get_user_by_email(db, email: str):
    return db.execute(select(models.User).where(models.User.email == email)).scalar_one_or_none()

def get_user_by_id(db, user_id):
    return db.query(models.User).filter_by(id=user_id).first()

def create_user(db, user_create):
    db_user = models.User(
        email=user_create.email,
        full_name=user_create.full_name,
        hashed_password=get_password_hash(user_create.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_user_password(db_user, plain_password):
    return verify_password(plain_password, db_user.hashed_password)
