from sqlalchemy.orm import Session
from db_models.speaking_session import SpeakingSession
from db_models.evaluation import Evaluation


class SessionRepository:

    @staticmethod
    def create(
        db: Session,
        user_id,
        topic,
        topic_description,
        transcript,
        duration_seconds,
        language="English"
    ):

        session = SpeakingSession(
            user_id=user_id,
            topic=topic,
            topic_description=topic_description,
            transcript=transcript,
            duration_seconds=duration_seconds,
            language=language
        )

        db.add(session)
        db.commit()
        db.refresh(session)

        return session

    @staticmethod
    def get_by_id(db: Session, session_id):

        return (
            db.query(SpeakingSession)
            .filter(SpeakingSession.id == session_id)
            .first()
        )

    @staticmethod
    def get_user_sessions(db: Session, user_id):

        return (
            db.query(SpeakingSession, Evaluation)
            .join(
                Evaluation,
                Evaluation.session_id == SpeakingSession.id
            )
            .filter(
                SpeakingSession.user_id == user_id
            )
            .order_by(
                SpeakingSession.created_at.desc()
            )
            .all()
        )

    @staticmethod
    def delete(db: Session, session):

        db.delete(session)
        db.commit()