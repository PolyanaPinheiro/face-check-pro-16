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
    """Pega o Base64 do banco, o Base64 da câmera e joga no DeepFace"""
    try:
        # 1. Busca a string Base64 que você acabou de criar na tabela do banco
        base64_do_banco = FaceRepository.buscar_embedding_por_usuario(payload.user_id)
        
        if not base64_do_banco:
            raise HTTPException(status_code=404, detail="Operador não possui nenhuma assinatura facial cadastrada.")
            
        # 2. Transforma as DUAS strings Base64 em imagens que o OpenCV/DeepFace entendem
        img_banco_cv2 = base64_to_cv2(base64_do_banco)   # Foto antiga do banco
        img_atual_cv2 = base64_to_cv2(payload.image)      # Foto nova da câmera do celular
        
        # 3. O DeepFace faz a mágica: compara as duas imagens brutas diretamente!
        result = DeepFace.verify(
            img1_path=img_atual_cv2,
            img2_path=img_banco_cv2,
            model_name=MODEL_NAME,
            distance_metric="cosine",
            enforce_detection=False
        )
        
        # Devolve o resultado limpo para o Node e o Frontend
        return {
            "match": bool(result["verified"]),
            "distance": float(result["distance"])
        }
        
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Falha interna na verificação: {str(e)}")

if __name__ == "__main__":
    # Mudamos de "main:app" para "app.main:app" para o uvicorn achar o módulo correto
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)