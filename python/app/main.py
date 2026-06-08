#------------------------------------------------------------------------------------
""" Esse codigo serve para criar um microserviço de IA de reconhecimento facial utilizando a biblioteca DeepFace. Ele expõe duas APIs principais: uma para registrar a biometria facial do operador durante o onboarding, e outra para validar essa biometria durante o checklist diário. O serviço é construído com FastAPI, garantindo alta performance e facilidade de integração com outros sistemas. A comunicação entre o frontend (ou API intermediária) e este microserviço é feita através de requisições HTTP, onde as imagens são enviadas em formato Base64. O serviço processa essas imagens, extrai os embeddings faciais usando o modelo Facenet512, e armazena ou compara esses embeddings conforme necessário. A arquitetura é projetada para ser escalável e segura, garantindo que os dados sensíveis sejam tratados adequadamente. """
#------------------------------------------------------------------------------------

import uvicorn
import numpy as np  # Biblioteca matemática adicionada para resolver o Bug 3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from deepface import DeepFace
from app.utils import base64_to_cv2
from app.repository import FaceRepository
from app.config import settings

import json
from scipy.spatial.distance import cosine

app = FastAPI(title="Microserviço de Inteligência Facial DeepFace", version="1.0.0")

# Modelos de entrada para validação de tipo das APIs (Pydantic)
class FaceRegisterRequest(BaseModel):
    image: str  # String Base64 vinda da API Node/Frontend
    user_id: str

class FaceValidateRequest(BaseModel):
    image: str  # String Base64 vinda do frame atual da câmera do celular
    user_id: str

# Configuração do modelo de IA de acordo com os requisitos (Facenet512 / ArcFace são os mais precisos)
MODEL_NAME = "Facenet512" 

@app.post("/register")
def register_face(payload: FaceRegisterRequest):
    """Extrai as características faciais da foto tirada no onboarding e salva no Postgres"""
    try:
        # 1. Transforma o Base64 enviado pelo front em uma imagem estruturada
        img_cv2 = base64_to_cv2(payload.image)
        
        # 2. Utiliza o DeepFace para extrair o array de 512 dimensões (Embedding vetorial)
        embeddings_meta = DeepFace.represent(
            img_path=img_cv2,
            model_name=MODEL_NAME,
            enforce_detection=False,
            detector_backend="opencv"
        )
        
        if not embeddings_meta or len(embeddings_meta) == 0:
            raise HTTPException(status_code=400, detail="Nenhum rosto claro pôde ser detectado na imagem.")
            
        vetor_facial = embeddings_meta[0]["embedding"]
        
        # 3. Guarda diretamente no banco PostgreSQL via repositório nativo
        sucesso = FaceRepository.salvar_novo_embedding(payload.user_id, vetor_facial)
        
        if not sucesso:
            raise HTTPException(status_code=500, detail="Erro interno ao registrar assinatura no banco.")
            
        return {"success": True, "message": "Biometria facial mapeada e salva com sucesso."}
        
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro no processamento da imagem: {str(e)}")


@app.post("/validate")
def validate_face(payload: FaceValidateRequest):
    """Compara os embeddings numéricos salvos no banco com a nova foto da câmera"""
    try:
        # 1. Busca os números (embedding) que estão na tabela do banco
        embedding_banco_raw = FaceRepository.buscar_embedding_por_usuario(payload.user_id)
        
        if not embedding_banco_raw:
            raise HTTPException(status_code=404, detail="Operador não possui nenhuma assinatura facial cadastrada.")
            
        # CONSERTO CRÍTICO: Como salvamos como TEXT, transforma a string do banco de volta em lista de números
        if isinstance(embedding_banco_raw, str):
            embedding_banco = json.loads(embedding_banco_raw)
        else:
            embedding_banco = embedding_banco_raw
        
        # 2. Transforma a foto NOVA da câmera em uma imagem que o OpenCV entende
        img_atual_cv2 = base64_to_cv2(payload.image)
        
        # 3. A IA extrai os 512 números APENAS da foto nova da câmera
        result_atual = DeepFace.represent(
            img_path=img_atual_cv2,
            model_name=MODEL_NAME,
            enforce_detection=False
        )
        embedding_atual = result_atual[0]["embedding"]
        
        # 4. Compara os números do banco com os números da câmera usando a distância do cosseno
        # (Exatamente a matemática que o DeepFace usa por dentro no .verify)
        distancia = cosine(embedding_banco, embedding_atual)
        
        # O limite padrão de mercado para o modelo Facenet/VGG-Face varia, 
        # mas geralmente se a distância for MENOR que 0.40, é a mesma pessoa!
        LIMITE_CORRESPONDENCIA = 0.40
        is_match = bool(distancia < LIMITE_CORRESPONDENCIA)
        
        # Devolve o resultado perfeito para o Node e o Frontend
        return {
            "match": is_match,
            "distance": float(distancia)
        }
        
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Falha interna na verificação: {str(e)}")
    
if __name__ == "__main__":
    # Mudamos de "main:app" para "app.main:app" para o uvicorn achar o módulo correto
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)