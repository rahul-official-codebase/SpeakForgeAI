import os

from fastapi import Depends
from fastapi import HTTPException
from fastapi import Request
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

from clerk_backend_api import Clerk
from clerk_backend_api.security.types import AuthenticateRequestOptions

from core.database import SessionLocal
from repositories.user_repository import UserRepository

security = HTTPBearer()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


async def get_current_user(

    request: Request,

    credentials=Depends(security),

    db: Session = Depends(get_db)

):

    sdk = Clerk(

        bearer_auth=os.getenv("CLERK_SECRET_KEY")

    )

    request_state = sdk.authenticate_request(

        request,

        AuthenticateRequestOptions(

            authorized_parties=[

                "http://localhost:3000"

            ]

        )

    )

    if not request_state.is_signed_in:

        raise HTTPException(

            status_code=401,

            detail="Unauthorized"

        )

    payload = request_state.payload

    clerk_user_id = payload["sub"]

    user = UserRepository.get_by_clerk_id(

        db,

        clerk_user_id=clerk_user_id,

    )

    if user:

        return user

    clerk_user = sdk.users.get(

        user_id=clerk_user_id

    )

    email = ""

    if clerk_user.email_addresses:

        email = clerk_user.email_addresses[0].email_address

    full_name = f"{clerk_user.first_name or ''} {clerk_user.last_name or ''}".strip()

    user = UserRepository.create(

        db=db,

        clerk_user_id=clerk_user_id,

        email=email,

        full_name=full_name

    )

    return user