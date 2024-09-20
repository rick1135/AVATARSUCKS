document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:3000';
    const insertForm = document.getElementById('insertMachineryForm');
    const maquinariosTable = document.getElementById('maquinariosTable').querySelector('tbody');

    insertForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(insertForm);
        const data = Object.fromEntries(formData);

        try {
            let response;
            const modeloParaAtualizar = insertForm.getAttribute('data-update');
            if (modeloParaAtualizar) {
                const encodedModelo = encodeURIComponent(modeloParaAtualizar);
                response = await axios.put(`${apiBaseUrl}/maquinarios/${encodedModelo}`, data);
            } else {
                response = await axios.post(`${apiBaseUrl}/maquinarios`, data);
            }

            alert(response.data.message);
            insertForm.reset();
            loadMaquinarios();
        } catch (error) {
            console.error('Erro ao inserir/atualizar o maquinário:', error);
            alert('Erro ao inserir/atualizar o maquinário.');
        }
    });

    async function loadMaquinarios() {
        try {
            const response = await axios.get(`${apiBaseUrl}/maquinarios`);
            maquinariosTable.innerHTML = '';

            response.data.forEach(maquinario => {
                const row = `
                    <tr>
                        <td>${maquinario[0]}</td>
                        <td>${maquinario[1]}</td>
                        <td>${maquinario[2]}</td>
                        <td>
                            <button class="update-btn" data-modelo="${maquinario[0]}">Atualizar</button>
                            <button class="delete-btn" data-modelo="${maquinario[0]}">Deletar</button>
                        </td>
                    </tr>`;
                maquinariosTable.insertAdjacentHTML('beforeend', row);
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const modelo = event.target.getAttribute('data-modelo');
                    if (confirm(`Tem certeza que deseja deletar o maquinário '${modelo}'?`)) {
                        try {
                            const response = await axios.delete(`${apiBaseUrl}/maquinarios/${modelo}`);
                            alert(response.data.message);
                            loadMaquinarios();
                        } catch (error) {
                            console.error('Erro ao deletar o maquinário:', error);
                            alert('Erro ao deletar o maquinário.');
                        }
                    }
                });
            });

            document.querySelectorAll('.update-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const modelo = event.target.getAttribute('data-modelo');
                    try {
                        const maquinario = response.data.find(m => m[0] === modelo);

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

    loadMaquinarios();
});
