from sqlalchemy import Column, Integer, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from core.database import Base


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    session_id = Column(
        UUID(as_uuid=True),
        ForeignKey("speaking_sessions.id"),
        nullable=False
    )

    relevance = Column(Integer)

    fluency = Column(Integer)

    grammar = Column(Integer)

    vocabulary = Column(Integer)

    confidence = Column(Integer)

    overall_score = Column(Integer)

    strengths = Column(Text)

    weaknesses = Column(Text)

    suggestions = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())