from fastapi import APIRouter, Request
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/general", tags=["general"])

@router.get("/welcome")
def welcome(request: Request):
    logger.info(f"Request received: {request.method} {request.url.path}")
    return {"message": "Welcome to the AuthFlow API!"}
