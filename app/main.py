import logging
from fastapi import FastAPI
from app.database import engine
from app import models
from app.routers import auth, users, general

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AuthFlow")

# Dev helper: create tables (use Alembic in production)
models.Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(general.router)
