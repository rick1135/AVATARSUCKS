document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:3000';

    const insertForm = document.getElementById('insertForm');
    const pesquisasTable = document.getElementById('pesquisasTable')?.querySelector('tbody');
    const cientistasSelect = document.getElementById('cientistaSelect');
    const laboratoriosSelect = document.getElementById('laboratorioSelect');

    if (!cientistasSelect || !laboratoriosSelect) {
        console.error('Elementos de seleção não encontrados no DOM.');
        return;
    }

    async function loadCientistas() {
        try {
            const response = await axios.get(`${apiBaseUrl}/pesquisas/cientistas`);
            console.log("Resposta da API de cientistas:", response.data);
            cientistasSelect.innerHTML = '';
    
            response.data.forEach(cientista => {
                const option = document.createElement('option');
                option.value = cientista[0];
                option.textContent = cientista[0];
                cientistasSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar os cientistas:', error);
        }
    }
    
    async function loadLaboratorios() {
        try {
            const response = await axios.get(`${apiBaseUrl}/pesquisas/laboratorios`);
            console.log("Resposta da API de laboratórios:", response.data);
            laboratoriosSelect.innerHTML = '';
    
            response.data.forEach(laboratorio => {
                const option = document.createElement('option');
                option.value = laboratorio[0];
                option.textContent = laboratorio[0];
                laboratoriosSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar os laboratórios:', error);
        }
    }

    insertForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const submitButton = insertForm.querySelector('button[type="submit"]');
        submitButton.disabled = true; 
        
        const formData = new FormData(insertForm);
        const data = Object.fromEntries(formData);
        
        data.resultado = parseInt(data.resultado);
        data.qtd_equip = parseInt(data.qtd_equip);
        data.consumo_energia = parseFloat(data.consumo_energia);
        data.id_cientista = parseInt(data.id_cientista);
        
        console.log('Dados enviados (convertidos):', data);
        
        const pesquisaParaAtualizar = insertForm.getAttribute('data-update');
        
        try {
            let response;
            if (pesquisaParaAtualizar) {
                const encodedNome = encodeURIComponent(pesquisaParaAtualizar);
                response = await axios.put(`${apiBaseUrl}/pesquisas/${encodedNome}`, data);
            } else {
                response = await axios.post(`${apiBaseUrl}/pesquisas`, data);
            }
            
            console.log('Status da resposta:', response.status);
            console.log('Dados da resposta:', response.data);
            
            if (response.status >= 200 && response.status < 300) {
                alert(response.data.message);
                insertForm.reset();
                loadPesquisas();
            } else {
                throw new Error(`Erro inesperado com status ${response.status}`);
            }
        } catch (error) {
            console.error('Erro ao inserir/atualizar a pesquisa:', error);
            alert('Erro ao inserir/atualizar a pesquisa.');
        } finally {
            submitButton.disabled = false;
        }
    });
    
    async function loadPesquisas() {
        try {
            const response = await axios.get(`${apiBaseUrl}/pesquisas`);
            console.log("Dados de pesquisas recebidos:", response.data);
            pesquisasTable.innerHTML = '';
    
            response.data.forEach(pesquisa => {
                const resultado = (parseInt(pesquisa[1], 10) === 1) ? 'Sucesso' : 'Fracasso';
                
                const row = `
                    <tr>
                        <td>${pesquisa[0]}</td>  <!-- Nome da Pesquisa -->
                        <td>${resultado}</td>  <!-- Resultado (Sucesso ou Fracasso) -->
                        <td>${pesquisa[2]}</td>  <!-- Quantidade de Equipamentos -->
                        <td>${pesquisa[3]}</td>  <!-- Nome do Equipamento -->
                        <td>${pesquisa[4]}</td>  <!-- Utilidade -->
                        <td>${pesquisa[5]}</td>  <!-- Consumo de Energia -->
                        <td>${pesquisa[6]}</td>  <!-- Cientista (ID) -->
                        <td>${pesquisa[7]}</td>  <!-- Laboratório (Sigla) -->
                        <td>
                            <button class="update-btn" data-nome="${pesquisa[0]}">Atualizar</button>
                            <button class="delete-btn" data-nome="${pesquisa[0]}">Deletar</button>
                        </td>
                    </tr>`;
                pesquisasTable.insertAdjacentHTML('beforeend', row);
            });
    
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const nome = event.target.getAttribute('data-nome');
                    if (confirm(`Tem certeza que deseja deletar a pesquisa '${nome}'?`)) {
                        try {
                            const response = await axios.delete(`${apiBaseUrl}/pesquisas/${nome}`);
                            alert(response.data.message);
                            loadPesquisas();
                        } catch (error) {
                            console.error('Erro ao deletar a pesquisa:', error);
                            alert('Erro ao deletar a pesquisa.');
                        }
                    }
                });
            });
                document.querySelectorAll('.update-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const nome = event.target.getAttribute('data-nome');
                    try {
                        const pesquisa = response.data.find(p => p[0] === nome);

                        document.getElementById('nome').value = pesquisa[0];
                        document.getElementById('resultado').value = pesquisa[1];
                        document.getElementById('qtd_equip').value = pesquisa[2];
                        document.getElementById('nome_equip').value = pesquisa[3];
                        document.getElementById('utilidade').value = pesquisa[4];
                        document.getElementById('consumo_energia').value = pesquisa[5];
                        document.getElementById('cientistaSelect').value = pesquisa[6];
                        document.getElementById('laboratorioSelect').value = pesquisa[7];

                        document.getElementById('insertForm').setAttribute('data-update', nome);
            
                        alert(`Modifique os dados no formulário e clique em "Inserir" para salvar as alterações.`);
                    } catch (error) {
                        console.error('Erro ao buscar a pesquisa para atualizar:', error);
                        alert('Erro ao buscar a pesquisa para atualizar.');
                    }
                });
            });
            
        } catch (error) {
            console.error('Erro ao carregar as pesquisas:', error);
        }
    }
    
    loadCientistas();
    loadLaboratorios();
    loadPesquisas();
});

document.addEventListener('DOMContentLoaded', () => {
    const btnMaquinario = document.getElementById('btn-maquinario');
    const btnEscavadeira = document.getElementById('btn-escavadeira');
    const btnCaminhao = document.getElementById('btn-caminhao');

    btnMaquinario.addEventListener('click', () => {
        window.location.href = 'maquinario.html';
    });

    btnEscavadeira.addEventListener('click', () => {
        window.location.href = 'escavadeira.html';
    });

    btnCaminhao.addEventListener('click', () => {
        window.location.href = 'caminhao.html';
    });
});
