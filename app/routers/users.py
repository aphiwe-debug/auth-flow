from fastapi import APIRouter, Depends
from app.deps import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
def read_current_user(current_user = Depends(get_current_user)):
    return {"id": str(current_user.id), "email": current_user.email, "is_verified": current_user.is_verified, "full_name": current_user.full_name}
