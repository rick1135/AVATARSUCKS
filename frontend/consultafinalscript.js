document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await axios.get("http://localhost:3000/consultas");
        const dados = response.data;
        console.log(dados);

        const tabelaBody = document.querySelector("#tabela-dados tbody");

        if (dados.length === 0) {
            console.log("No data found.");
            return;
        }

        dados.forEach(dado => {
            const row = document.createElement("tr");

            const columns = [
                dado[0],  //sigla_colonia
                dado[1],  //apelido_colonia
                dado[2],  //tipo_colonia
                dado[3],  //sigla_laboratorio
                dado[4],  //nome_laboratorio
                dado[5],  //finalidade_laboratorio
                dado[6],  //sigla_residencia
                dado[7],  //nome_residencia
                dado[8],  //qtd_cama_residencia
                dado[9],  //qtd_banheiro_residencia
                dado[10], //sigla_deposito
                dado[11], //nome_deposito
                dado[12], //tipo_material_deposito
                dado[13], //nome_minerador
                dado[14], //nome_cientista
                dado[15], //nome_equipamento
                dado[16], //utilidade_equipamento
                dado[17], //consumo_energia_equipamento
                dado[18], //latitude_jazida
                dado[19], //altura_jazida
                dado[20], //longitude_jazida
                dado[21], //modelo_maquinario
                dado[22], //potencia_maquinario
            ];

            columns.forEach(col => {
                const cell = document.createElement("td");
                console.log("Valor da célula:", col);
                cell.textContent = col ? col : "N/A";
                row.appendChild(cell);
            });

            tabelaBody.appendChild(row);
        });
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
});
