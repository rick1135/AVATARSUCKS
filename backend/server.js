const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const oracledb = require('oracledb');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors()); // Habilita CORS
app.use(bodyParser.json()); // Suporte para JSON

// Função para obter conexão com o banco de dados Oracle
async function getConnection() {
    return await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectionString: process.env.DB_CONNECTION_STRING
    });
}

// Middleware para gerenciar a conexão
app.use(async (req, res, next) => {
    try {
        req.db = await getConnection();
        next();
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
    }
});

// Rotas
const pesquisasRoutes = require('./routes/pesquisas');
const maquinarioRoutes = require('./routes/maquinarios');
const escavadeiraRoutes = require('./routes/escavadeiras');
const caminhaoRoutes = require('./routes/caminhoes');
const consultasRoutes = require('./routes/consultas');

app.use('/pesquisas', pesquisasRoutes);
app.use('/maquinarios', maquinarioRoutes);
app.use('/escavadeiras', escavadeiraRoutes);
app.use('/caminhoes', caminhaoRoutes);
app.use('/consultas', consultasRoutes);

// Fecha a conexão ao finalizar a requisição
app.use(async (req, res, next) => {
    if (req.db) {
        try {
            await req.db.close();
        } catch (error) {
            console.error('Erro ao fechar conexão com o banco:', error);
        }
    }
    next();
});

// Porta do servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
