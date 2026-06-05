import requests
import os
import base64

# Encontra a pasta atual e o caminho da foto real
PASTA_ATUAL = os.path.dirname(os.path.abspath(__file__))
CAMINHO_IMAGEM_REAL = os.path.join(PASTA_ATUAL, "foto.jpg")

try:
    # 1. Abre a foto real diretamente em modo binário puro
    with open(CAMINHO_IMAGEM_REAL, "rb") as arquivo_imagem:
        # Transforma os bytes da imagem em Base64 limpo sem qualquer erro de texto
        base64_puro = base64.b64encode(arquivo_imagem.read()).decode('utf-8')
    
    # Monta o cabeçalho correto exigido pela API
    IMAGEM_COM_CABECALHO = f"data:image/jpeg;base64,{base64_puro}"
    
except FileNotFoundError:
    print(f"❌ Erro: Coloque uma foto chamada 'foto.jpg' na pasta: {PASTA_ATUAL}")
    exit()

# 2. Configura os dados que vão para o banco
payload = {
    "user_id": "Poly",
    "image": IMAGEM_COM_CABECALHO
}

# 3. Dispara o envio para a sua API Node
try:
    print("🚀 Enviando imagem real convertida para a API...")
    resposta = requests.post("http://localhost:3001/api/face/register", json=payload)
    print(f"📡 Status Code: {resposta.status_code}")
    print(f"📥 Resposta do Servidor: {resposta.json()}")
except Exception as e:
    print(f"❌ Erro ao conectar com o servidor Node: {e}")