from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class SessionCreate(BaseModel):
    topic: str
    topic_description: str
    transcript: str
    duration_seconds: int
    language: str = "English"


class SessionResponse(BaseModel):
    id: UUID
    user_id: UUID
    topic: str
    topic_description: str
    transcript: str
    duration_seconds: int
    language: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)