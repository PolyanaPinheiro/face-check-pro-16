import base64
import cv2
import numpy as np

def base64_to_cv2(base64_string: str):
    """
    Decodifica uma string Base64 vinda do Frontend TypeScript
    e a transforma em uma imagem legível pela OpenCV (cv2)
    """
    try:
        # Se a string contiver o cabeçalho 'data:image/jpeg;base64,', limpa antes de decodificar
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]
            
        img_data = base64.b64decode(base64_string)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Conversão resultou em uma imagem vazia.")
        return img
    except Exception as e:
        raise ValueError(f"Falha ao decodificar imagem em Base64: {str(e)}")