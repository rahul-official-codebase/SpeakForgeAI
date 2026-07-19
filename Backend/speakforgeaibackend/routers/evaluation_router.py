from fastapi import APIRouter
from fastapi import Depends
from fastapi import UploadFile
from fastapi import File
from fastapi import Form
from sqlalchemy.orm import Session

from core.dependencies import get_db

from services.speech_service import SpeechService
from services.evaluation_service import EvaluationService
from core.auth import get_current_user

router = APIRouter()

speech_service = SpeechService()

evaluation_service = EvaluationService()

@router.post("/evaluate")
async def evaluate(
    topic: str = Form(...),
    topic_description: str = Form(""),
    difficulty: str = Form("Easy"),
    prep_seconds: int = Form(0),
    speak_seconds: int = Form(60),
    duration_seconds: int = Form(60),
    audio: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    transcript = speech_service.transcribe(audio)

    result = evaluation_service.evaluate(
        db=db,
        clerk_user_id=current_user.clerk_user_id,
        email=current_user.email,
        full_name=current_user.full_name,
        topic=topic,
        topic_description=topic_description,
        difficulty=difficulty,
        transcript=transcript,
        duration=duration_seconds
    )

    return result