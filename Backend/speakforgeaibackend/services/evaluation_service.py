from repositories.user_repository import UserRepository
from repositories.session_repository import SessionRepository
from repositories.evaluation_repository import EvaluationRepository

from services.Evaluator import Evaluator
from core.auth import get_current_user

class EvaluationService:

    def __init__(self):

        self.evaluator = Evaluator()

    def evaluate(
        self,
        db,
        clerk_user_id,
        email,
        full_name,
        topic,
        topic_description,
        difficulty,
        transcript,
        duration
    ):

        feedback = self.evaluator.evaluate(
            topic,
            transcript
        )

        user = UserRepository.get_by_clerk_id(db, clerk_user_id)

        if not user:

            user = UserRepository.create(
                db,
                clerk_user_id=clerk_user_id,
                email=email,
                full_name=full_name
            )

        session = SessionRepository.create(

            db=db,

            user_id=user.id,

            topic=topic,

            topic_description=topic_description,

            transcript=transcript,

            duration_seconds=duration
        )

        EvaluationRepository.create(

            db=db,

            session_id=session.id,

            relevance=feedback["relevance"],

            fluency=feedback["fluency"],

            grammar=feedback["grammar"],

            vocabulary=feedback["vocabulary"],

            confidence=feedback["confidence"],

            overall_score=feedback["overall_score"],

            strengths=feedback["strengths"],

            weaknesses=feedback["weaknesses"],

            suggestions=feedback["suggestions"]

        )

        return {

            "transcript": transcript,

            "feedback": feedback

        }