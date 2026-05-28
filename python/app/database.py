import psycopg2
from psycopg2.extras import RealDictCursor
from app.config import settings

def get_db_connection():
    """Estabelece a conexão direta do Python com o banco PostgreSQL"""
    try:
        conn = psycopg2.connect(settings.DATABASE_URL, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"[DATABASE ERROR]: Não foi possível conectar ao PostgreSQL: {e}")
        raise e