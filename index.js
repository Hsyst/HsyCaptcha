const express = require('express');
const cors = require('cors');
const { createCanvas } = require('canvas');
const session = require('express-session');
const crypto = require('crypto');
const app = express();
const port = 3001;


// --> Configuração de CORS.
// ----------------------------------
//const corsOptions = {
//    origin: 'https://hsyst.xyz',
//    credentials: true,
//};
//-----------------------------------
// app.use(cors(corsOptions));


app.use(express.static('www')); // Arquivo JS do badge do captcha
app.use(express.json());
app.use(session({
    secret: 'secret_padrão_123321123321', // Altere essa secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

// Chave e IV para criptografia AES (devem ser seguras e únicas)
const AES_KEY = crypto.randomBytes(32); // Chave AES de 256 bits
const AES_IV = crypto.randomBytes(16); // Vetor de inicialização de 128 bits

// Função para criptografar texto usando AES
function encryptAES(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, AES_IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Função para descriptografar texto usando AES
function decryptAES(encryptedText) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, AES_IV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Lista de palavras aleatórias para o captcha
const words = [
    'gato', 'cachorro', 'elefante', 'leão', 'tigre', 'zebra', 'girafa', 'macaco',
    'papagaio', 'coelho', 'pato', 'cavalo', 'burro', 'ovelha', 'bode', 'vaca', 'porco',
    'cavalo-marinho', 'urso', 'lobo', 'raposa', 'pantera', 'jaguatirica', 'onça', 'aguia',
    'corvo', 'coruja', 'mesa', 'cadeira', 'caneta', 'livro', 'janela', 'porta', 'computador',
    'telefone', 'lampada', 'carro', 'bicicleta', 'avião', 'navio', 'ônibus', 'trólebus', 'trem',
    'relógio', 'espelho', 'celular', 'tablet', 'cadeado', 'chave', 'escrivaninha', 'cama', 'sofá',
    'abajur', 'fogão', 'geladeira', 'micro-ondas', 'televisão', 'ar-condicionado', 'ventilador', 'rádio',
    'cachoeira', 'montanha', 'floresta', 'praia', 'rio', 'lago', 'deserto', 'campo', 'cidade', 'vila',
    'bairro', 'rua', 'avenida', 'estrada', 'praça', 'parque', 'museu', 'teatro', 'cinema', 'restaurante',
    'escola', 'universidade', 'biblioteca', 'igreja', 'templo', 'mercado', 'loja', 'supermercado', 'shopping',
    'hospital', 'clínica', 'farmácia', 'correios', 'polícia', 'bombeiros', 'governo', 'eleições', 'direitos',
    'liberdade', 'justiça', 'igualdade', 'fraternidade', 'paz', 'amor', 'solidariedade', 'amizade', 'felicidade',
    'tristeza', 'medo', 'raiva', 'alegria', 'surpresa', 'esperança', 'dúvida', 'certeza', 'sabedoria', 'inteligência',
    'conhecimento', 'sabedoria', 'inovação', 'criatividade', 'arte', 'música', 'dança', 'teatro', 'cinema', 'literatura',
    'poesia', 'romance', 'conto', 'filme', 'documentário', 'canção', 'melodia', 'ritmo', 'nota', 'acorde', 'instrumento',
    'violão', 'guitarra', 'piano', 'bateria', 'flauta', 'saxofone', 'cavaco', 'harpa', 'sanfona', 'teclado', 'voz',
    'harmonia', 'composição', 'gravação', 'produção', 'show', 'festival', 'concerto', 'orquestra', 'banda', 'coral',
    'Hsyst', 'op3n', "OpenSource", "Hsyst Org", "Discord"
];

// Função para distorcer texto
function distortText(ctx, text, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.4); // Rotação aleatória
    ctx.fillText(text, 0, 0);
    ctx.restore();
}

// Função para adicionar ruído
function addNoise(ctx, width, height) {
    for (let i = 0; i < 100; i++) {
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
        ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }

    // Adiciona linhas aleatórias
    for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.stroke();
    }
}

// Rota para gerar o captcha
app.post('/gen_captcha', (req, res) => {
    // Escolhe uma palavra aleatória
    const correctText = words[Math.floor(Math.random() * words.length)];

    // Gera um token único
    const token = Math.random().toString(36).substring(2, 15);

    // Armazena o texto correto e o token na sessão
    req.session.captchaToken = token;
    req.session.correctText = correctText;
    req.session.captchaGeneratedAt = Date.now(); // Armazena o horário de geração

    // Cria 4 imagens de captcha (apenas uma correta)
    const images = [];
    for (let i = 0; i < 4; i++) {
        const canvas = createCanvas(150, 50);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '30px Arial';
        ctx.fillStyle = '#000';

        // Apenas uma imagem contém o texto correto
        const displayText = i === 0 ? correctText : generateWrongText(correctText);
        distortText(ctx, displayText, 10, 35);

        // Adiciona ruído e distorções
        addNoise(ctx, canvas.width, canvas.height);

        // Criptografa o texto da imagem usando AES
        const encryptedText = encryptAES(displayText);
        images.push({ image: canvas.toDataURL(), token: encryptedText });
    }

    // Aleatoriza a ordem das imagens
    shuffleArray(images);

    // Retorna apenas as imagens e seus tokens AES
    res.json({ images });
});

// Função para gerar texto incorreto
function generateWrongText(text) {
    const replacements = {
        'a': ['4', '@'],
        'e': ['3'],
        'i': ['1', '!'],
        'o': ['0'],
        's': ['5', '$'],
    };

    return text
        .split('')
        .map(char => {
            const possibleReplacements = replacements[char.toLowerCase()];
            if (possibleReplacements) {
                return possibleReplacements[Math.floor(Math.random() * possibleReplacements.length)];
            }
            return char; // Mantém o caractere original se não houver substituição
        })
        .join('');
}

// Função para aleatorizar um array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Rota para validar o captcha
app.post('/validate_captcha', (req, res) => {
    const { token } = req.body;

    // Verifica se o token foi fornecido
    if (!token) {
        return res.status(400).json({ error: 'Token é obrigatório' });
    }

    // Verifica se o captcha foi gerado e se o token ainda é válido
    if (!req.session.captchaToken || !req.session.correctText) {
        return res.status(400).json({ error: 'Captcha não gerado ou expirado' });
    }

    // Verifica se o captcha expirou (por exemplo, 5 minutos)
    if (Date.now() - req.session.captchaGeneratedAt > 5 * 60 * 1000) {
        return res.status(400).json({ error: 'Captcha expirado. Gere um novo.' });
    }

    // Descriptografa o token AES
    const decryptedText = decryptAES(token);

    // Remove espaços e converte para minúsculas para evitar erros de comparação
    const isValid = decryptedText.trim().toLowerCase() === req.session.correctText.trim().toLowerCase();

    // Invalida o token e o correctText após a validação
    delete req.session.captchaToken;
    delete req.session.correctText;
    delete req.session.captchaGeneratedAt;

    // Armazena o estado de autorização na sessão
    if (isValid) {
        req.session.captchaAuthorized = true;
    }

    res.json({ valid: isValid });
});

// Rota para verificar se o captcha foi autorizado
app.get('/check_authorization', (req, res) => {
    if (req.session.captchaAuthorized) {
        res.json({ authorized: true });
    } else {
        res.json({ authorized: false });
    }
});

// Rota para invalidar a autorização do captcha
app.post('/invalidate_captcha', (req, res) => {
    // Redefine o estado de autorização na sessão
    req.session.captchaAuthorized = false;
    res.json({ success: true, message: 'Autorização do captcha invalidada com sucesso.' });
});

app.listen(port, () => {
    console.log(`API do Captcha rodando em http://localhost:${port}`);
});
