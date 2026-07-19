from repositories.user_repository import UserRepository
from repositories.session_repository import SessionRepository


class SessionService:

    def get_history(self, db, clerk_user_id):

        user = UserRepository.get_by_clerk_id(
            db,
            clerk_user_id
        )
        print("User test ",user)
        if not user:
            return {
                "sessions": []
            }
        print("User found successfully")
        rows = SessionRepository.get_user_sessions(
            db,
            user.id
        )

        sessions = []

        for session, evaluation in rows:

            sessions.append({
                "id": session.id,
                "topic": session.topic,
                "date": session.created_at.strftime("%Y-%m-%d"),
                "overallScore": evaluation.overall_score
            })

        print(">>>>>>>>>>>>>>",session)

        return {
            "sessions": sessions
        }   