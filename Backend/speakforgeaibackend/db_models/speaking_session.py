from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from core.database import Base


class SpeakingSession(Base):
    __tablename__ = "speaking_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    topic = Column(String(500), nullable=False)

    topic_description = Column(Text, nullable=True)

    transcript = Column(Text, nullable=False)

    duration_seconds = Column(Integer)

    language = Column(String(50), default="English")

    created_at = Column(DateTime(timezone=True), server_default=func.now())