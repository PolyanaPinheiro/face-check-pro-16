import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

// Configurações de Middleware
app.use(cors());
// IMPORTANTE: Como as imagens trafegam em Base64, aumentamos o limite do JSON para não dar erro de "Payload Too Large"
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/**
 * FASE 1: REGISTRO (Onboarding do Usuário)
 * Fluxo: Front (Base64) -> API Node -> Python/DeepFace -> Salva no Postgres (via Python) -> Retorna Sucesso
 */
app.post('/face/register', async (req, res) => {
  try {
    const { image, user_id } = req.body;

    // Validação básica de entrada
    if (!image || !user_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Os campos "image" (base64) e "user_id" são obrigatórios.' 
      });
    }

    console.log(`[API] Solicitando registro facial para o usuário: ${user_id}`);

    // Envia os dados para o serviço Python (FastAPI + DeepFace)
    // De acordo com seu fluxo, o próprio Python lida com a busca/salvamento do embedding no Postgres
    const pythonResponse = await axios.post(`${PYTHON_SERVICE_URL}/register`, {
      image: image,
      user_id: user_id
    });

    // Repassa a resposta de sucesso do Python de volta para o Frontend (React)
    return res.status(200).json({
      success: true,
      message: 'Assinatura facial registrada com sucesso no banco de dados.',
      data: pythonResponse.data
    });

  } catch (error) {
    console.error('[API ERROR - Register]:', error.message);
    
    if (error.response) {
      // O microserviço Python respondeu com um erro programado
      return res.status(error.response.status).json({ 
        success: false, 
        error: error.response.data.detail || 'Erro no processamento da IA Python.' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      error: 'Não foi possível conectar ao microsserviço de IA Python.' 
    });
  }
});

/**
 * FASE 2: VALIDAÇÃO (Cada assinatura do checklist)
 * Fluxo: Front (Base64) -> API Node -> Python/DeepFace (Compara) -> Retorna Score -> API Node valida limiar -> Front
 */
app.post('/face/validate', async (req, res) => {
  try {
    const { image, user_id } = req.body;

    if (!image || !user_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Os campos "image" (base64) e "user_id" são obrigatórios para a validação.' 
      });
    }

    console.log(`[API] Validando identidade facial para o usuário: ${user_id}`);

    // Repassa a imagem base64 atual capturada pela câmera do celular para o detector.py por HTTP POST
    const pythonResponse = await axios.post(`${PYTHON_SERVICE_URL}/validate`, {
      image: image,
      user_id: user_id
    });

    // O Python devolve a estrutura do seu diagrama: { match: bool, distance: float }
    const { match, distance } = pythonResponse.data;

    // Regra de Negócio: De acordo com o seu gráfico, usamos a distância coseno do ArcFace.
    // Na distância coseno, quanto menor a distância, mais parecidos são os rostos.
    // Um score tolerável comum para o ArcFace em distância coseno é menor que 0.60 para ser a mesma pessoa.
    // Vamos cruzar o "match" que a IA calculou e formatar a resposta amigável para o Frontend
    if (match) {
      return res.status(200).json({
        validated: true,
        score: (1 - distance).toFixed(2), // Transforma a distância em um índice de confiança aproximado (Ex: 0.91)
        message: 'Assinatura facial validada! Operador autorizado.'
      });
    } else {
      return res.status(200).json({
        validated: false,
        score: (1 - distance).toFixed(2),
        message: 'Biometria não confere com o operador deste checklist.'
      });
    }

  } catch (error) {
    console.error('[API ERROR - Validate]:', error.message);

    if (error.response) {
      return res.status(error.response.status).json({ 
        success: false, 
        error: error.response.data.detail || 'Erro na verificação facial do Python.' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      error: 'Erro interno ao tentar processar autenticação de biometria.' 
    });
  }
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` API Gatekeeper Node.js ativa na porta: ${PORT}`);
  console.log(` Conectada ao microserviço Python em: ${PYTHON_SERVICE_URL}`);
  console.log(`==================================================`);
});