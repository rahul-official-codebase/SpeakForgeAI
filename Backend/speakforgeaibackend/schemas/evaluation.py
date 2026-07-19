from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class EvaluationCreate(BaseModel):
    relevance: int
    fluency: int
    grammar: int
    vocabulary: int
    confidence: int
    overall_score: int
    strengths: str
    weaknesses: str
    suggestions: str


class EvaluationResponse(BaseModel):
    id: UUID
    session_id: UUID

    relevance: int
    fluency: int
    grammar: int
    vocabulary: int
    confidence: int

    overall_score: int

    strengths: str
    weaknesses: str
    suggestions: str

    created_at: datetime

    model_config = ConfigDict(from_attributes=True)