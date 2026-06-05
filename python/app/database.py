import psycopg2
from psycopg2.extras import RealDictCursor
from app.config import settings

def get_db_connection():
    """Estabelece a conexão direta do Python com o banco PostgreSQL"""
    try:
        conn = psycopg2.connect(settings.DATABASE_URL, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
    # Mudado para repr(e) para não quebrar com acentos do Windows
        print(f"[DATABASE ERROR]: Não foi possível conectar ao PostgreSQL: {repr(e)}")