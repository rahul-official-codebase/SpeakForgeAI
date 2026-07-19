from repositories.user_repository import UserRepository


class UserService:

    @staticmethod
    def get_or_create(
        db,
        clerk_user_id,
        email,
        full_name
    ):

        user = UserRepository.get_by_clerk_id(
            db,
            clerk_user_id
        )

        if user:

            return user

        return UserRepository.create(

            db,

            clerk_user_id,

            email,

            full_name

        )