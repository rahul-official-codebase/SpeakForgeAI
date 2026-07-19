from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.dependencies import get_db
from services.session_service import SessionService

router = APIRouter(
    tags=["Sessions"]
)

session_service = SessionService()


@router.get("/sessions/{clerk_user_id}")
def get_session_history(
    clerk_user_id: str,
    db: Session = Depends(get_db)
):
    print("\n\n Hello world\n\n")
    return session_service.get_history(
        db,
        clerk_user_id
    )