from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.topic_router import router as topic_router
from routers.evaluation_router import router as evaluation_router
from routers.session_router import router as session_router
from core.database import Base, engine

from db_models.user import User
from db_models.speaking_session import SpeakingSession
from db_models.evaluation import Evaluation

Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="SpeakForge AI"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    topic_router,
    prefix="/api"
)

app.include_router(
    evaluation_router,
    prefix="/api"
)

app.include_router(
    session_router,
    prefix="/api"
)