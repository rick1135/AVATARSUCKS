const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        col.sigla AS sigla_colonia,
        col.apelido AS apelido_colonia,
        col.tipo AS tipo_colonia,
        lab.sigla AS sigla_laboratorio,
        lab.nome AS nome_laboratorio,
        lab.finalidade AS finalidade_laboratorio,
        res.sigla AS sigla_residencia,
        res.nome AS nome_residencia,
        res.qtd_cama AS qtd_cama_residencia,
        res.qtd_banheiro AS qtd_banheiro_residencia,
        dep.sigla AS sigla_deposito,
        dep.nome AS nome_deposito,
        dep.tipo_material AS tipo_material_deposito,
        miner.nome AS nome_minerador,
        miner.funcao AS funcao_minerador,
        cient.nome AS nome_cientista,
        cient.especializacao AS especializacao_cientista,
        pesq.nome AS nome_pesquisa,
        pesq.nome_equip AS nome_equipamento_pesquisa,
        pesq.utilidade AS utilidade_equipamento,
        pesq.consumo_energia AS consumo_energia_equipamento,
        jaz.latitude AS latitude_jazida,
        jaz.altura AS altura_jazida,
        jaz.longitude AS longitude_jazida,
        maq.modelo AS modelo_maquinario,
        maq.peso_operacional AS peso_maquinario,
        maq.potencia AS potencia_maquinario
      FROM 
        colonia col
      LEFT JOIN colonia_formada_lab cflab ON col.sigla = cflab.sigla_colonia
      LEFT JOIN laboratorio lab ON cflab.sigla_lab = lab.sigla
      LEFT JOIN colonia_formada_res cfres ON col.sigla = cfres.sigla_colonia
      LEFT JOIN residencia res ON cfres.sigla_resid = res.sigla
      LEFT JOIN colonia_formada_dep cfdep ON col.sigla = cfdep.sigla_colonia
      LEFT JOIN deposito dep ON cfdep.sigla_dep = dep.sigla
      LEFT JOIN minerador miner ON miner.id_exploracao = col.id_jazida
      LEFT JOIN cientista cient ON cient.id_exploracao = col.id_jazida
      LEFT JOIN pesquisa pesq ON pesq.id_cientista = cient.id
      LEFT JOIN jazida jaz ON col.id_jazida = jaz.id
      LEFT JOIN exploracao expl ON expl.id_jazida = jaz.id
      LEFT JOIN maquinario maq ON expl.modelo_maq = maq.modelo
      ORDER BY col.sigla
    `;

    const result = await req.db.execute(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao executar a consulta:", error);
    res.status(500).send("Erro ao buscar dados");
  }
});

module.exports = router;
