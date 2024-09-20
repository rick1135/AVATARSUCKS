document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:3000'; // Caminho correto do servidor Node.js
    const insertForm = document.getElementById('insertForm');
    const escavadeirasTable = document.getElementById('escavadeirasTable').querySelector('tbody');

    // Função para inserir ou atualizar uma escavadeira
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
                response = await axios.put(`${apiBaseUrl}/escavadeiras/${encodedModelo}`, data);
            } else {
                // Se for uma inserção, faz uma requisição POST
                response = await axios.post(`${apiBaseUrl}/escavadeiras`, data);
            }

            alert(response.data.message); // Alerta de sucesso
            insertForm.reset(); // Reseta o formulário
            loadEscavadeiras(); // Recarrega a lista de escavadeiras
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                // Exibe a mensagem de erro do backend, como no caso de disjunção
                alert(error.response.data.message);
            } else {
                alert('Erro ao inserir/atualizar a escavadeira.');
            }
        }
    });

    // Função para carregar escavadeiras e preencher a tabela
    async function loadEscavadeiras() {
        try {
            const response = await axios.get(`${apiBaseUrl}/escavadeiras`);
            escavadeirasTable.innerHTML = ''; // Limpar a tabela antes de preenchê-la

            // Itera sobre cada escavadeira e adiciona uma nova linha à tabela
            response.data.forEach(escavadeira => {
                const row = `
                    <tr>
                        <td>${escavadeira[0]}</td> <!-- Modelo -->
                        <td>${escavadeira[1]}</td> <!-- Capacidade da Pá -->
                        <td>
                            <button class="update-btn" data-modelo="${escavadeira[0]}">Atualizar</button>
                            <button class="delete-btn" data-modelo="${escavadeira[0]}">Deletar</button>
                        </td>
                    </tr>`;
                escavadeirasTable.insertAdjacentHTML('beforeend', row);
            });

            // Adicionar evento de clique para os botões de deletar
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const modelo = event.target.getAttribute('data-modelo');
                    if (confirm(`Tem certeza que deseja deletar a escavadeira '${modelo}'?`)) {
                        try {
                            const response = await axios.delete(`${apiBaseUrl}/escavadeiras/${modelo}`);
                            alert(response.data.message);
                            loadEscavadeiras(); // Recarrega a lista de escavadeiras após a deleção
                        } catch (error) {
                            console.error('Erro ao deletar a escavadeira:', error);
                            alert('Erro ao deletar a escavadeira.');
                        }
                    }
                });
            });

            // Adicionar evento de clique para os botões de atualizar
            document.querySelectorAll('.update-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const modelo = event.target.getAttribute('data-modelo');
                    try {
                        const escavadeira = response.data.find(e => e[0] === modelo);

                        // Preencher o formulário com os dados da escavadeira selecionada
                        document.getElementById('modelo_maq').value = escavadeira[0];
                        document.getElementById('capacidade_pa').value = escavadeira[1];

                        insertForm.setAttribute('data-update', modelo);
                        alert('Modifique os dados e clique em "Inserir" para atualizar.');
                    } catch (error) {
                        console.error('Erro ao buscar a escavadeira para atualizar:', error);
                        alert('Erro ao buscar a escavadeira para atualizar.');
                    }
                });
            });
        } catch (error) {
            console.error('Erro ao carregar as escavadeiras:', error);
        }
    }

    // Carregar escavadeiras ao iniciar a página
    loadEscavadeiras();
});
