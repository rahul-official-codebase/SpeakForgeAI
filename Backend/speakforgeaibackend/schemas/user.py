from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    clerk_user_id: str
    email: str
    full_name: str | None = None


class UserResponse(BaseModel):
    id: UUID
    clerk_user_id: str
    email: str
    full_name: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)