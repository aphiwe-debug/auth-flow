from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from uuid import UUID

class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class UserCreate(UserBase):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserOut(UserBase):
    id: UUID
    email: EmailStr
    full_name: Optional[str]
    is_active: bool
    is_verified: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: Optional[str] = None
