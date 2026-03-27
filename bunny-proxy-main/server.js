import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente (arquivo .env)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Configurações vindas do .env (NUNCA MAIS COLOQUE AS CHAVES DIRETAMENTE AQUI)
const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const API_KEY = process.env.BUNNY_API_KEY;
const HOSTNAME = process.env.BUNNY_HOSTNAME || 'br.storage.bunnycdn.com';
const JWT_SECRET = process.env.JWT_SECRET || 'chave-secreta-padrao-mude-no-env';
const SYSTEM_PASSWORD = process.env.SYSTEM_PASSWORD || 'exemplo';

app.use(cors());
app.use(express.json());

// 1. Proteção contra ataques de força bruta no Login (Rate Limiting)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Limita a 10 tentativas de login por IP
  message: { error: 'Muitas tentativas de login, tente novamente em 15 minutos.' }
});

// 2. Rota de Login
app.post('/api/login', loginLimiter, (req, res) => {
  const { password } = req.body;

  if (password === SYSTEM_PASSWORD) {
    // Gera um token válido por 8 horas
    const token = jwt.sign({ user: 'colaborador_alvorada' }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ success: true, token });
  }

  return res.status(401).json({ success: false, error: 'Senha incorreta' });
});

// 3. Middleware de Autenticação (Protege as rotas de listagem e download)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (!token) return res.status(401).json({ error: 'Acesso negado. Faça login.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Sessão expirada ou inválida.' });
    req.user = user;
    next();
  });
};

// 4. Rota de Listagem (Agora Protegida)
app.get('/list', authenticateToken, async (req, res) => {
  try {
    const path = req.query.path || '';
    if (!path) return res.status(400).json({ error: 'Parâmetro path é obrigatório' });

    const normalizedPath = path.endsWith('/') ? path : path + '/';
    const url = `https://${HOSTNAME}/${STORAGE_ZONE}/${normalizedPath}`;

    const response = await fetch(url, {
      headers: {
        AccessKey: API_KEY,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'Erro ao listar arquivos', details: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro interno no servidor', details: err.message });
  }
});

// 5. Rota de Download (Agora Protegida)
app.get('/download', authenticateToken, async (req, res) => {
  const path = req.query.path;
  if (!path) return res.status(400).json({ error: 'Parâmetro path é obrigatório' });

  const url = `https://${HOSTNAME}/${STORAGE_ZONE}/${path}`;

  try {
    const response = await fetch(url, {
      headers: { AccessKey: API_KEY }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${decodeURIComponent(path.split('/').pop())}"`);
    
    // Node-fetch v3: body é um web stream, precisamos usar pipeline ou converter
    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao baixar o arquivo', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor seguro rodando na porta ${PORT}`);
});;