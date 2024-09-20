const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await req.db.execute(`SELECT * FROM ESCAVADEIRA`);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar escavadeiras:', error);
        res.status(500).json({ message: 'Erro ao listar escavadeiras.' });
    }
});

router.post('/', async (req, res) => {
    const { modelo_maq, capacidade_pa } = req.body;

    try {
        const checkQuery = `SELECT MODELO_MAQ FROM CAMINHAO WHERE MODELO_MAQ = :modelo_maq`;
        const checkResult = await req.db.execute(checkQuery, [modelo_maq]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ message: `Erro: O modelo '${modelo_maq}' já existe na tabela CAMINHÃO.` });
        }

        const query = `
            INSERT INTO ESCAVADEIRA (MODELO_MAQ, CAPACIDADE_PA)
            VALUES (:modelo_maq, :capacidade_pa)
        `;
        await req.db.execute(query, [modelo_maq, capacidade_pa], { autoCommit: true });
        res.status(201).json({ message: 'Escavadeira inserida com sucesso!' });
    } catch (error) {
        console.error('Erro ao inserir escavadeira:', error);
        res.status(500).json({ message: 'Erro ao inserir escavadeira.' });
    }
});

router.delete('/:modelo_maq', async (req, res) => {
    const modelo_maq = req.params.modelo_maq;

    try {
        const query = `DELETE FROM ESCAVADEIRA WHERE MODELO_MAQ = :modelo_maq`;
        await req.db.execute(query, [modelo_maq], { autoCommit: true });
        res.json({ message: `Escavadeira '${modelo_maq}' deletada com sucesso!` });
    } catch (error) {
        console.error('Erro ao deletar escavadeira:', error);
        res.status(500).json({ message: 'Erro ao deletar escavadeira.' });
    }
});

router.put('/:modelo_maq', async (req, res) => {
    const modeloOriginal = req.params.modelo_maq;
    const { modelo_maq, capacidade_pa } = req.body;

    try {
        const query = `
            UPDATE ESCAVADEIRA
            SET MODELO_MAQ = :modelo_maq, CAPACIDADE_PA = :capacidade_pa
            WHERE MODELO_MAQ = :modeloOriginal
        `;
        await req.db.execute(query, [modelo_maq, capacidade_pa, modeloOriginal], { autoCommit: true });
        res.json({ message: `Escavadeira '${modelo_maq}' atualizada com sucesso!` });
    } catch (error) {
        console.error('Erro ao atualizar escavadeira:', error);
        res.status(500).json({ message: 'Erro ao atualizar escavadeira.' });
    }
});

module.exports = router;
