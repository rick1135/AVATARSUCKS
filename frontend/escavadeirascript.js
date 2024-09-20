document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:3000';
    const insertForm = document.getElementById('insertForm');
    const escavadeirasTable = document.getElementById('escavadeirasTable').querySelector('tbody');

    insertForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(insertForm);
        const data = Object.fromEntries(formData);

        try {
            let response;
            const modeloParaAtualizar = insertForm.getAttribute('data-update');
            if (modeloParaAtualizar) {
                const encodedModelo = encodeURIComponent(modeloParaAtualizar);
                response = await axios.put(`${apiBaseUrl}/escavadeiras/${encodedModelo}`, data);
            } else {
                response = await axios.post(`${apiBaseUrl}/escavadeiras`, data);
            }

            alert(response.data.message);
            insertForm.reset();
            loadEscavadeiras();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Erro ao inserir/atualizar a escavadeira.');
            }
        }
    });

    async function loadEscavadeiras() {
        try {
            const response = await axios.get(`${apiBaseUrl}/escavadeiras`);
            escavadeirasTable.innerHTML = ''; 

            response.data.forEach(escavadeira => {
                const row = `
                    <tr>
                        <td>${escavadeira[0]}</td> <!--modelo -->
                        <td>${escavadeira[1]}</td> <!--capacidade da Pá -->
                        <td>
                            <button class="update-btn" data-modelo="${escavadeira[0]}">Atualizar</button>
                            <button class="delete-btn" data-modelo="${escavadeira[0]}">Deletar</button>
                        </td>
                    </tr>`;
                escavadeirasTable.insertAdjacentHTML('beforeend', row);
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const modelo = event.target.getAttribute('data-modelo');
                    if (confirm(`Tem certeza que deseja deletar a escavadeira '${modelo}'?`)) {
                        try {
                            const response = await axios.delete(`${apiBaseUrl}/escavadeiras/${modelo}`);
                            alert(response.data.message);
                            loadEscavadeiras();
                        } catch (error) {
                            console.error('Erro ao deletar a escavadeira:', error);
                            alert('Erro ao deletar a escavadeira.');
                        }
                    }
                });
            });

            document.querySelectorAll('.update-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const modelo = event.target.getAttribute('data-modelo');
                    try {
                        const escavadeira = response.data.find(e => e[0] === modelo);

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

    loadEscavadeiras();
});
