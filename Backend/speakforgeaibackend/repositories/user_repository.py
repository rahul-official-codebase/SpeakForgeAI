from sqlalchemy.orm import Session
from db_models.user import User


class UserRepository:

    @staticmethod
    def get_by_clerk_id(db: Session, clerk_user_id: str):
        return (
            db.query(User)
            .filter(User.clerk_user_id == clerk_user_id)
            .first()
        )

    @staticmethod
    def get_by_email(db: Session, email: str):
        return (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        clerk_user_id: str,
        email: str,
        full_name: str
    ):
        user = User(
            clerk_user_id=clerk_user_id,
            email=email,
            full_name=full_name
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user