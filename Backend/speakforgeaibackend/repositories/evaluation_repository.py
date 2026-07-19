from sqlalchemy.orm import Session
from db_models.evaluation import Evaluation


class EvaluationRepository:

    @staticmethod
    def create(
        db: Session,
        session_id,
        relevance,
        fluency,
        grammar,
        vocabulary,
        confidence,
        overall_score,
        strengths,
        weaknesses,
        suggestions
    ):

        evaluation = Evaluation(
            session_id=session_id,
            relevance=relevance,
            fluency=fluency,
            grammar=grammar,
            vocabulary=vocabulary,
            confidence=confidence,
            overall_score=overall_score,
            strengths=strengths,
            weaknesses=weaknesses,
            suggestions=suggestions
        )

        db.add(evaluation)
        db.commit()
        db.refresh(evaluation)

        return evaluation

    @staticmethod
    def get_by_session(db: Session, session_id):

        return (
            db.query(Evaluation)
            .filter(Evaluation.session_id == session_id)
            .first()
        )