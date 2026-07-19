from sqlalchemy import text

from database import engine

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT current_database()"))
        print(result.scalar())

        result = conn.execute(text("SELECT version()"))
        print(result.scalar())

        print("Database Connected Successfully!")

except Exception as e:
    print(e)