#------------------------------------------------------------------------------------
""" Esse codigo serve para criar um microserviço de IA de reconhecimento facial utilizando a biblioteca DeepFace. Ele expõe duas APIs principais: uma para registrar a biometria facial do operador durante o onboarding, e outra para validar essa biometria durante o checklist diário. O serviço é construído com FastAPI, garantindo alta performance e facilidade de integração com outros sistemas. A comunicação entre o frontend (ou API intermediária) e este microserviço é feita através de requisições HTTP, onde as imagens são enviadas em formato Base64. O serviço processa essas imagens, extrai os embeddings faciais usando o modelo Facenet512, e armazena ou compara esses embeddings conforme necessário. A arquitetura é projetada para ser escalável e segura, garantindo que os dados sensíveis sejam tratados adequadamente. """
#------------------------------------------------------------------------------------




import uvicorn
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
            enforce_detection=True,
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
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro no processamento da imagem: {str(e)}")


@app.post("/validate")
def validate_face(payload: FaceValidateRequest):
    """Compara o frame atual capturado no checklist com o vetor guardado no banco de dados"""
    try:
        # 1. Recupera o vetor guardado no banco do respectivo operador
        embedding_banco = FaceRepository.buscar_embedding_por_usuario(payload.user_id)
        
        if not embedding_banco:
            raise HTTPException(status_code=44, detail="Operador não possui nenhuma assinatura facial cadastrada.")
            
        # 2. Transforma o frame vindo da câmera do celular em imagem cv2
        img_atual_cv2 = base64_to_cv2(payload.image)
        
        # 3. Extrai o embedding do frame atual
        embeddings_atuais_meta = DeepFace.represent(
            img_path=img_atual_cv2,
            model_name=MODEL_NAME,
            enforce_detection=False, # Evita quebras se o operador piscar ou se mover rápido demais
            detector_backend="opencv"
        )
        
        if not embeddings_atuais_meta or len(embeddings_atuais_meta) == 0:
            raise HTTPException(status_code=400, detail="Não foi possível mapear o rosto no frame da câmera.")
            
        embedding_atual = embeddings_atuais_meta[0]["embedding"]
        
        # 4. Executa a verificação matemática comparando os dois vetores (Distância Coseno)
        # O DeepFace aceita passar os próprios vetores brutos como entrada nos campos de imagem
        result = DeepFace.verify(
            img1_path=embedding_atual,
            img2_path=embedding_banco,
            model_name=MODEL_NAME,
            distance_metric="cosine",
            enforce_detection=False
        )
        
        # Devolve exatamente a assinatura esperada pela API intermediária do Node.js
        return {
            "match": bool(result["verified"]),
            "distance": float(result["distance"])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Falha interna na verificação: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)