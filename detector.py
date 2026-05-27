#a imagem processada aqui tem que vir do API que veio do TypeScript
import cv2
from deepface import DeepFace

img1 = "Imagem do Front-end"
img2 = "Imagem do Banco de Dados"

#Tratar imagem que veio do front
#-------------------------------

#Buscar imagem no banco de dados
#-------------------------------

#Comparar as imagens usando o DeepFace
models = [
    "VGG-Face", "Facenet", "Facenet512", "OpenFace", "DeepFace",
    "DeepID", "ArcFace", "Dlib", "SFace", "GhostFaceNet",
    "Buffalo_L",
]


result= DeepFace.verify(
    img1_path = img1,
    img2_path = img2,
    model_name = models[2], #aqui é problema, creio que o orimeiro seja o melhor
    enforce_detection=False
)

print(result) #: dict 
