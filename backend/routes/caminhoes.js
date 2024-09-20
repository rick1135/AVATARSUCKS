const express = require('express');
const router = express.Router();

// Rota para listar todos os caminhões
router.get('/', async (req, res) => {
    try {
        const result = await req.db.execute(`SELECT * FROM CAMINHAO`);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar caminhões:', error);
        res.status(500).json({ message: 'Erro ao listar caminhões.' });
    }
});

// Rota para inserir um novo caminhão com verificação de modelo na tabela ESCAVADEIRA
router.post('/', async (req, res) => {
    const { modelo_maq, capacidade_cacamba } = req.body;

    try {
        // Verificar se o modelo já existe na tabela ESCAVADEIRA
        const checkQuery = `SELECT MODELO_MAQ FROM ESCAVADEIRA WHERE MODELO_MAQ = :modelo_maq`;
        const checkResult = await req.db.execute(checkQuery, [modelo_maq]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ message: `Erro: O modelo '${modelo_maq}' já existe na tabela ESCAVADEIRA.` });
        }

        // Inserir o caminhão se não houver conflito de modelo
        const query = `
            INSERT INTO CAMINHAO (MODELO_MAQ, CAPACIDADE_CACAMBA)
            VALUES (:modelo_maq, :capacidade_cacamba)
        `;
        await req.db.execute(query, [modelo_maq, capacidade_cacamba], { autoCommit: true });
        res.status(201).json({ message: 'Caminhão inserido com sucesso!' });
    } catch (error) {
        console.error('Erro ao inserir caminhão:', error);
        res.status(500).json({ message: 'Erro ao inserir caminhão.' });
    }
});

// Rota para deletar um caminhão pelo modelo
router.delete('/:modelo_maq', async (req, res) => {
    const modelo_maq = req.params.modelo_maq;

    try {
        const query = `DELETE FROM CAMINHAO WHERE MODELO_MAQ = :modelo_maq`;
        await req.db.execute(query, [modelo_maq], { autoCommit: true });
        res.json({ message: `Caminhão '${modelo_maq}' deletado com sucesso!` });
    } catch (error) {
        console.error('Erro ao deletar caminhão:', error);
        res.status(500).json({ message: 'Erro ao deletar caminhão.' });
    }
});

// Rota para atualizar um caminhão
router.put('/:modelo_maq', async (req, res) => {
    const modeloOriginal = req.params.modelo_maq;
    const { modelo_maq, capacidade_cacamba } = req.body;

    try {
        const query = `
            UPDATE CAMINHAO
            SET MODELO_MAQ = :modelo_maq, CAPACIDADE_CACAMBA = :capacidade_cacamba
            WHERE MODELO_MAQ = :modeloOriginal
        `;
        await req.db.execute(query, [modelo_maq, capacidade_cacamba, modeloOriginal], { autoCommit: true });
        res.json({ message: `Caminhão '${modelo_maq}' atualizado com sucesso!` });
    } catch (error) {
        console.error('Erro ao atualizar caminhão:', error);
        res.status(500).json({ message: 'Erro ao atualizar caminhão.' });
    }
});

module.exports = router;
