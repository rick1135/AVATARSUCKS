document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:3000'; // Caminho correto do servidor Node.js
    const insertForm = document.getElementById('insertForm');
    const caminhoesTable = document.getElementById('caminhoesTable').querySelector('tbody');

    // Função para inserir ou atualizar um caminhão
    insertForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previne a submissão padrão do formulário

        const formData = new FormData(insertForm);
        const data = Object.fromEntries(formData);

        try {
            let response;
            const modeloParaAtualizar = insertForm.getAttribute('data-update');
            if (modeloParaAtualizar) {
                // Se for uma atualização, faz uma requisição PUT
                const encodedModelo = encodeURIComponent(modeloParaAtualizar);
                response = await axios.put(`${apiBaseUrl}/caminhoes/${encodedModelo}`, data);
            } else {
                // Se for uma inserção, faz uma requisição POST
                response = await axios.post(`${apiBaseUrl}/caminhoes`, data);
            }

            alert(response.data.message); // Alerta de sucesso
            insertForm.reset(); // Reseta o formulário
            loadCaminhoes(); // Recarrega a lista de caminhões
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                // Exibe a mensagem de erro do backend, como no caso de disjunção
                alert(error.response.data.message);
            } else {
                alert('Erro ao inserir/atualizar o caminhão.');
            }
        }
    });

    // Função para carregar caminhões e preencher a tabela
    async function loadCaminhoes() {
        try {
            const response = await axios.get(`${apiBaseUrl}/caminhoes`);
            caminhoesTable.innerHTML = ''; // Limpar a tabela antes de preenchê-la

            // Itera sobre cada caminhão e adiciona uma nova linha à tabela
            response.data.forEach(caminhao => {
                const row = `
                    <tr>
                        <td>${caminhao[0]}</td> <!-- Modelo -->
                        <td>${caminhao[1]}</td> <!-- Capacidade da Caçamba -->
                        <td>
                            <button class="update-btn" data-modelo="${caminhao[0]}">Atualizar</button>
                            <button class="delete-btn" data-modelo="${caminhao[0]}">Deletar</button>
                        </td>
                    </tr>`;
                caminhoesTable.insertAdjacentHTML('beforeend', row);
            });

            // Adicionar evento de clique para os botões de deletar
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const modelo = event.target.getAttribute('data-modelo');
                    if (confirm(`Tem certeza que deseja deletar o caminhão '${modelo}'?`)) {
                        try {
                            const response = await axios.delete(`${apiBaseUrl}/caminhoes/${modelo}`);
                            alert(response.data.message);
                            loadCaminhoes(); // Recarrega a lista de caminhões após a deleção
                        } catch (error) {
                            console.error('Erro ao deletar o caminhão:', error);
                            alert('Erro ao deletar o caminhão.');
                        }
                    }
                });
            });

            // Adicionar evento de clique para os botões de atualizar
            document.querySelectorAll('.update-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const modelo = event.target.getAttribute('data-modelo');
                    try {
                        const caminhao = response.data.find(c => c[0] === modelo);

                        // Preencher o formulário com os dados do caminhão selecionado
                        document.getElementById('modelo_maq').value = caminhao[0];
                        document.getElementById('capacidade_cacamba').value = caminhao[1];

                        insertForm.setAttribute('data-update', modelo);
                        alert('Modifique os dados e clique em "Inserir" para atualizar.');
                    } catch (error) {
                        console.error('Erro ao buscar o caminhão para atualizar:', error);
                        alert('Erro ao buscar o caminhão para atualizar.');
                    }
                });
            });
        } catch (error) {
            console.error('Erro ao carregar os caminhões:', error);
        }
    }

    // Carregar caminhões ao iniciar a página
    loadCaminhoes();
});
