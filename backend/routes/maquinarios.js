const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await req.db.execute(`SELECT * FROM MAQUINARIO`);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar maquinários:', error);
        res.status(500).json({ message: 'Erro ao listar maquinários.' });
    }
});

router.post('/', async (req, res) => {
    const { modelo, peso_operacional, potencia } = req.body;

    try {
        const query = `
            INSERT INTO MAQUINARIO (MODELO, PESO_OPERACIONAL, POTENCIA)
            VALUES (:modelo, :peso_operacional, :potencia)
        `;
        await req.db.execute(query, [modelo, peso_operacional, potencia], { autoCommit: true });
        res.status(201).json({ message: 'Maquinário inserido com sucesso!' });
    } catch (error) {
        console.error('Erro ao inserir maquinário:', error);
        res.status(500).json({ message: 'Erro ao inserir maquinário.' });
    }
});

router.delete('/:modelo', async (req, res) => {
    const modelo = req.params.modelo;

    try {
        const query = `DELETE FROM MAQUINARIO WHERE MODELO = :modelo`;
        await req.db.execute(query, [modelo], { autoCommit: true });
        res.json({ message: `Maquinário '${modelo}' deletado com sucesso!` });
    } catch (error) {
        console.error('Erro ao deletar maquinário:', error);
        res.status(500).json({ message: 'Erro ao deletar maquinário.' });
    }
});

router.put('/:modelo', async (req, res) => {
    const modeloOriginal = req.params.modelo;
    const { modelo, peso_operacional, potencia } = req.body;

    try {
        const query = `
            UPDATE MAQUINARIO
            SET MODELO = :modelo, PESO_OPERACIONAL = :peso_operacional, POTENCIA = :potencia
            WHERE MODELO = :modeloOriginal
        `;
        await req.db.execute(query, [modelo, peso_operacional, potencia, modeloOriginal], { autoCommit: true });
        res.json({ message: `Maquinário '${modelo}' atualizado com sucesso!` });
    } catch (error) {
        console.error('Erro ao atualizar maquinário:', error);
        res.status(500).json({ message: 'Erro ao atualizar maquinário.' });
    }
});

module.exports = router;
