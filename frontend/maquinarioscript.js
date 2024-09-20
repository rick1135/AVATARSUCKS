document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:3000'; // Caminho correto do servidor Node.js
    const insertForm = document.getElementById('insertMachineryForm');
    const maquinariosTable = document.getElementById('maquinariosTable').querySelector('tbody');

    // Função para inserir ou atualizar um maquinário
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
                response = await axios.put(`${apiBaseUrl}/maquinarios/${encodedModelo}`, data);
            } else {
                // Se for uma inserção, faz uma requisição POST
                response = await axios.post(`${apiBaseUrl}/maquinarios`, data);
            }

            alert(response.data.message); // Alerta de sucesso
            insertForm.reset(); // Reseta o formulário
            loadMaquinarios(); // Recarrega a lista de maquinários
        } catch (error) {
            console.error('Erro ao inserir/atualizar o maquinário:', error);
            alert('Erro ao inserir/atualizar o maquinário.');
        }
    });

    // Função para carregar maquinários e preencher a tabela
    async function loadMaquinarios() {
        try {
            const response = await axios.get(`${apiBaseUrl}/maquinarios`);
            maquinariosTable.innerHTML = ''; // Limpar a tabela antes de preenchê-la

            // Itera sobre cada maquinário e adiciona uma nova linha à tabela
            response.data.forEach(maquinario => {
                const row = `
                    <tr>
                        <td>${maquinario[0]}</td> <!-- Modelo -->
                        <td>${maquinario[1]}</td> <!-- Peso Operacional -->
                        <td>${maquinario[2]}</td> <!-- Potência -->
                        <td>
                            <button class="update-btn" data-modelo="${maquinario[0]}">Atualizar</button>
                            <button class="delete-btn" data-modelo="${maquinario[0]}">Deletar</button>
                        </td>
                    </tr>`;
                maquinariosTable.insertAdjacentHTML('beforeend', row);
            });

            // Adicionar evento de clique para os botões de deletar
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const modelo = event.target.getAttribute('data-modelo');
                    if (confirm(`Tem certeza que deseja deletar o maquinário '${modelo}'?`)) {
                        try {
                            const response = await axios.delete(`${apiBaseUrl}/maquinarios/${modelo}`);
                            alert(response.data.message);
                            loadMaquinarios(); // Recarrega a lista de maquinários após a deleção
                        } catch (error) {
                            console.error('Erro ao deletar o maquinário:', error);
                            alert('Erro ao deletar o maquinário.');
                        }
                    }
                });
            });

            // Adicionar evento de clique para os botões de atualizar
            document.querySelectorAll('.update-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const modelo = event.target.getAttribute('data-modelo');
                    try {
                        const maquinario = response.data.find(m => m[0] === modelo);

                        // Preencher o formulário com os dados do maquinário selecionado
                        document.getElementById('modelo').value = maquinario[0];
                        document.getElementById('peso_operacional').value = maquinario[1];
                        document.getElementById('potencia').value = maquinario[2];

                        insertForm.setAttribute('data-update', modelo);
                        alert('Modifique os dados e clique em "Inserir" para atualizar.');
                    } catch (error) {
                        console.error('Erro ao buscar o maquinário para atualizar:', error);
                        alert('Erro ao buscar o maquinário para atualizar.');
                    }
                });
            });
        } catch (error) {
            console.error('Erro ao carregar os maquinários:', error);
        }
    }

    // Carregar maquinários ao iniciar a página
    loadMaquinarios();
});
