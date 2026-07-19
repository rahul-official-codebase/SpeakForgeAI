from core.database import engine, Base
class Session(Base):
    __tablename__ = "sessions"