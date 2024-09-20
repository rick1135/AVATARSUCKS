document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:3000'; // Caminho correto do servidor Node.js

    const insertForm = document.getElementById('insertForm');
    const pesquisasTable = document.getElementById('pesquisasTable')?.querySelector('tbody');
    const cientistasSelect = document.getElementById('cientistaSelect');
    const laboratoriosSelect = document.getElementById('laboratorioSelect');

    // Verifique se os elementos existem antes de tentar manipulá-los
    if (!cientistasSelect || !laboratoriosSelect) {
        console.error('Elementos de seleção não encontrados no DOM.');
        return;
    }

    // Função para carregar cientistas e preencher o select
    async function loadCientistas() {
        try {
            const response = await axios.get(`${apiBaseUrl}/pesquisas/cientistas`);
            console.log("Resposta da API de cientistas:", response.data);
            cientistasSelect.innerHTML = ''; // Limpa o select
    
            response.data.forEach(cientista => {
                const option = document.createElement('option');
                option.value = cientista[0];  // Mantém o ID como valor
                option.textContent = cientista[0];  // Exibe o ID no lugar do nome
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
            laboratoriosSelect.innerHTML = ''; // Limpa o select
    
            response.data.forEach(laboratorio => {
                const option = document.createElement('option');
                option.value = laboratorio[0];  // Mantém a SIGLA como valor
                option.textContent = laboratorio[0];  // Exibe a SIGLA no lugar do nome
                laboratoriosSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar os laboratórios:', error);
        }
    }

    // Função para inserir ou atualizar uma pesquisa
    insertForm.addEventListener('submit', async (event) => {
        event.preventDefault();  // Previne a submissão padrão do formulário
        
        const submitButton = insertForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;  // Desabilitar o botão de envio para evitar múltiplos cliques
        
        const formData = new FormData(insertForm);  // Pega os dados do formulário
        const data = Object.fromEntries(formData);  // Transforma os dados em um objeto JS
        
        // Convertendo campos que deveriam ser numéricos
        data.resultado = parseInt(data.resultado);  // 0 ou 1
        data.qtd_equip = parseInt(data.qtd_equip);  // Número de equipamentos
        data.consumo_energia = parseFloat(data.consumo_energia);  // Consumo de energia (float)
        data.id_cientista = parseInt(data.id_cientista);  // ID do cientista (inteiro)
        
        console.log('Dados enviados (convertidos):', data);  // Verifica os dados que estão sendo enviados
        
        const pesquisaParaAtualizar = insertForm.getAttribute('data-update');  // Verifica se estamos no modo de atualização
        
        try {
            let response;
            if (pesquisaParaAtualizar) {
                // Se for uma atualização, faz uma requisição PUT
                const encodedNome = encodeURIComponent(pesquisaParaAtualizar);
                response = await axios.put(`${apiBaseUrl}/pesquisas/${encodedNome}`, data);
            } else {
                // Se for uma inserção, faz uma requisição POST
                response = await axios.post(`${apiBaseUrl}/pesquisas`, data);
            }
            
            console.log('Status da resposta:', response.status);
            console.log('Dados da resposta:', response.data);
            
            if (response.status >= 200 && response.status < 300) {
                alert(response.data.message);  // Alerta de sucesso
                insertForm.reset();
                loadPesquisas();  // Recarrega a lista de pesquisas
            } else {
                throw new Error(`Erro inesperado com status ${response.status}`);
            }
        } catch (error) {
            console.error('Erro ao inserir/atualizar a pesquisa:', error);
            alert('Erro ao inserir/atualizar a pesquisa.');  // Alerta de erro
        } finally {
            submitButton.disabled = false;  // Reabilitar o botão após o processo
        }
    });
    
    

    // Função para carregar pesquisas e preencher a tabela
    async function loadPesquisas() {
        try {
            const response = await axios.get(`${apiBaseUrl}/pesquisas`);
            console.log("Dados de pesquisas recebidos:", response.data);
            pesquisasTable.innerHTML = ''; // Limpar a tabela antes de preenchê-la
    
            // Itera sobre cada pesquisa e adiciona uma nova linha à tabela
            response.data.forEach(pesquisa => {
                const resultado = (parseInt(pesquisa[1], 10) === 1) ? 'Sucesso' : 'Fracasso';
                
                // Cria a linha com os dados da pesquisa e os botões de atualizar e deletar
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
    
            // Adicionar evento de clique para os botões de deletar
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const nome = event.target.getAttribute('data-nome');
                    if (confirm(`Tem certeza que deseja deletar a pesquisa '${nome}'?`)) {
                        try {
                            const response = await axios.delete(`${apiBaseUrl}/pesquisas/${nome}`);
                            alert(response.data.message);
                            loadPesquisas();  // Recarrega a lista de pesquisas após a deleção
                        } catch (error) {
                            console.error('Erro ao deletar a pesquisa:', error);
                            alert('Erro ao deletar a pesquisa.');
                        }
                    }
                });
            });
    
            // Adicionar evento de clique para os botões de atualizar
            document.querySelectorAll('.update-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const nome = event.target.getAttribute('data-nome');
                    try {
                        // Buscar os dados da pesquisa pelo nome
                        const pesquisa = response.data.find(p => p[0] === nome);
            
                        // Preencher o formulário de inserção com os dados da pesquisa selecionada
                        document.getElementById('nome').value = pesquisa[0];
                        document.getElementById('resultado').value = pesquisa[1];
                        document.getElementById('qtd_equip').value = pesquisa[2];
                        document.getElementById('nome_equip').value = pesquisa[3];
                        document.getElementById('utilidade').value = pesquisa[4];
                        document.getElementById('consumo_energia').value = pesquisa[5];
                        document.getElementById('cientistaSelect').value = pesquisa[6];
                        document.getElementById('laboratorioSelect').value = pesquisa[7];
            
                        // Alterar a ação do botão de inserção para atualizar
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
    
    // Carregar cientistas, laboratórios e pesquisas ao iniciar a página
    loadCientistas();
    loadLaboratorios();
    loadPesquisas();
});

document.addEventListener('DOMContentLoaded', () => {
    // Referências aos botões de especialização
    const btnMaquinario = document.getElementById('btn-maquinario');
    const btnEscavadeira = document.getElementById('btn-escavadeira');
    const btnCaminhao = document.getElementById('btn-caminhao');

    // Redirecionar para maquinario.html
    btnMaquinario.addEventListener('click', () => {
        window.location.href = 'maquinario.html';  // Redireciona para maquinario.html
    });

    // Redirecionar para escavadeira.html
    btnEscavadeira.addEventListener('click', () => {
        window.location.href = 'escavadeira.html';  // Redireciona para escavadeira.html
    });

    // Redirecionar para caminhao.html
    btnCaminhao.addEventListener('click', () => {
        window.location.href = 'caminhao.html';  // Redireciona para caminhao.html
    });
});
