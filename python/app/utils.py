# -*- coding: utf-8 -*-
import base64
import cv2
import numpy as np

def base64_to_cv2(base64_string: str):
    """
    Decodifica uma string Base64 vinda do Frontend TypeScript
    e a transforma em uma imagem legivel pela OpenCV (cv2)
    """
    try:
        # Se a string contiver o cabecalho 'data:image/jpeg;base64,', limpa antes de decodificar
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]
            
        # Força a string a ser codificada em ascii puro removendo espaços e quebras de linha invisíveis
        base64_clean = base64_string.strip().encode('ascii', errors='ignore')
            
        img_data = base64.b64decode(base64_clean)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Conversao resultou em uma imagem vazia.")
        return img
    except Exception as e:
        # Usamos repr(e) em vez de str(e) para blindar contra erros de encoding UTF-8 do Windows
        erro_limpo = repr(e).encode('utf-8', errors='ignore').decode('utf-8')
        raise ValueError(f"Falha ao decodificar imagem em Base64: {erro_limpo}")