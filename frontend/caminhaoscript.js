document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:3000';
    const insertForm = document.getElementById('insertForm');
    const caminhoesTable = document.getElementById('caminhoesTable').querySelector('tbody');

    insertForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(insertForm);
        const data = Object.fromEntries(formData);

        try {
            let response;
            const modeloParaAtualizar = insertForm.getAttribute('data-update');
            if (modeloParaAtualizar) {
                const encodedModelo = encodeURIComponent(modeloParaAtualizar);
                response = await axios.put(`${apiBaseUrl}/caminhoes/${encodedModelo}`, data);
            } else {
                response = await axios.post(`${apiBaseUrl}/caminhoes`, data);
            }

            alert(response.data.message);
            insertForm.reset();
            loadCaminhoes();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Erro ao inserir/atualizar o caminhão.');
            }
        }
    });

    async function loadCaminhoes() {
        try {
            const response = await axios.get(`${apiBaseUrl}/caminhoes`);
            caminhoesTable.innerHTML = '';

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

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const modelo = event.target.getAttribute('data-modelo');
                    if (confirm(`Tem certeza que deseja deletar o caminhão '${modelo}'?`)) {
                        try {
                            const response = await axios.delete(`${apiBaseUrl}/caminhoes/${modelo}`);
                            alert(response.data.message);
                            loadCaminhoes();
                        } catch (error) {
                            console.error('Erro ao deletar o caminhão:', error);
                            alert('Erro ao deletar o caminhão.');
                        }
                    }
                });
            });

            document.querySelectorAll('.update-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const modelo = event.target.getAttribute('data-modelo');
                    try {
                        const caminhao = response.data.find(c => c[0] === modelo);

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

    loadCaminhoes();
});
