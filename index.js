import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
// Ajustado para 3000 para bater com as chamadas que o Lovable faz no Front
const PORT = process.env.PORT || 3001; 
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://100.100.209.74:8000';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/**
 * FASE 1: REGISTRO (Onboarding do Usuário)
 * Rota alterada para /api/face/register
 */
app.post('/api/face/register', async (req, res) => {
  try {
    const { image, user_id } = req.body;
  console.log(`[NODE API] 2. Foto recebida do Frontend. Repassando para o Python para o usuário: ${user_id}`);

    if (!image || !user_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Os campos "image" (base64) e "user_id" são obrigatórios.' 
      });
    }

    console.log(`[API] Solicitando registro facial para o usuário: ${user_id}`);

    const pythonResponse = await axios.post(`${PYTHON_SERVICE_URL}/register`, {
      image: image,
      user_id: user_id
    });

    return res.status(200).json({
      success: true,
      message: 'Assinatura facial registrada com sucesso no banco de dados.',
      data: pythonResponse.data
    });

  } catch (error) {
    console.error('[API ERROR - Register]:', error.message);
    
    if (error.response) {
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
 * Rota alterada para /api/face/validate -> IGUALZINHO ao que está no seu Front agora!
 */
app.post('/api/face/validate', async (req, res) => {
  try {
    const { image, user_id } = req.body;

    if (!image || !user_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Os campos "image" (base64) e "user_id" são obrigatórios para a validação.' 
      });
    }
    
    console.log(`[API] Validando identidade facial para o usuário: ${user_id}`);

    const pythonResponse = await axios.post(`${PYTHON_SERVICE_URL}/validate`, {
      image: image,
      user_id: user_id
    });
    
    console.log(`✨ [NODE API] 3. Python respondeu! Match: ${pythonResponse.data.match}, Distância: ${pythonResponse.data.distance}`);
    const { match, distance } = pythonResponse.data;

    if (match) {
      return res.status(200).json({
        validated: true,
        score: (1 - distance).toFixed(2), 
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