import json
from app.database import get_db_connection

class FaceRepository:
    @staticmethod
    def buscar_embedding_por_usuario(user_id: str):
        """Busca o vetor numérico (embedding) guardado no banco para o operador especificado"""
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            # Seleciona convertendo o tipo vector(512) para texto para leitura limpa do Python
            cursor.execute(
                'SELECT embedding::text FROM face_signatures WHERE "user_id" = %s ORDER BY "created_at" DESC LIMIT 1;',
                (user_id,)
            )
            registro = cursor.fetchone()
            if registro:
                # Transforma a string '[0.11, -0.02, ...]' de volta em uma lista nativa de floats do Python
                embedding_str = registro['embedding'].strip('[]')
                embedding_lista = [float(x) for x in embedding_str.split(',')]
                return embedding_lista
            return None
        except Exception as e:
            print(f"[REPOSITORY ERROR]: Erro ao buscar assinatura no banco: {e}")
            return None
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def salvar_novo_embedding(user_id: str, embedding: list):
        """Salva um novo registro facial gerado no onboarding do operador"""
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            # Formata a lista de floats para o formato padrão do cast do pgvector: [val1,val2,...]
            embedding_str = f"[{','.join(map(str, embedding))}]"
            
            cursor.execute(
                'INSERT INTO face_signatures ("user_id", embedding) VALUES (%s, %s::vector);',
                (user_id, embedding_str)
            )
            conn.commit()
            return True
        except Exception as e:
            print(f"[REPOSITORY ERROR]: Erro ao inserir assinatura no banco: {e}")
            conn.rollback()
            return False
        finally:
            cursor.close()
            conn.close()