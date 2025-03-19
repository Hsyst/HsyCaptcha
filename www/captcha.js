(function () {
    // Variáveis globais
    window.captchaToken = '';
    window.correctText = '';

    // Função para verificar a autorização no backend
    async function checkAuthorization() {
        try {
            alert("Arquivo captcha.js não configurado, abra o arquivo 'captcha.js' em seu servidor, e altere as informações pedidas no arquivo.")
            const response = await fetch('http://URL_DO_SEU_SITE_AQUI/check_authorization', { // Substitua URL_DO_SEU_SITE_AQUI pelo endereço do seu site, exemplo: 'http://127.0.0.1/check_authorization' para localhost.
                method: 'GET',
                credentials: 'include', // Inclui cookies na requisição
            });
            const { authorized } = await response.json();
            return authorized;
        } catch (error) {
            console.error('Erro ao verificar autorização:', error);
            return false;
        }
    }

    // Cria a badge do captcha
    const badge = document.createElement('button');
    badge.id = 'badge_captcha';
    badge.className = 'captcha-button';
    badge.innerHTML = 'Não sou um robô';
    badge.type = 'button';
    badge.style.cssText = `
        background-color: #007bff; /* Azul */
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin: 10px 0; /* Espaçamento */
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: background-color 0.3s ease;
    `;

    // Seleciona a div onde a badge será adicionada
    const captchaContainer = document.getElementById('captcha-container');
    captchaContainer.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    `;

    // Adiciona a badge na div
    captchaContainer.appendChild(badge);

    // Evento de clique na badge
    badge.addEventListener('click', async () => {
        // Verifica se o captcha já foi autorizado
        const isAuthorized = await checkAuthorization();
        if (isAuthorized) {
            alert('Autorizado!');
            return;
        }

        // Gera o captcha
        alert("Arquivo captcha.js não configurado, abra o arquivo 'captcha.js' em seu servidor, e altere as informações pedidas no arquivo.")
        const response = await fetch('http://URL_DO_SEU_SITE_AQUI/gen_captcha', { // Substitua URL_DO_SEU_SITE_AQUI pelo endereço do seu site, exemplo: 'http://127.0.0.1/gen_captcha' para localhost.
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Inclui cookies na requisição
        });
        const { images } = await response.json(); // O token e o correctText não são enviados ao cliente

        // Exibe o captcha em um pop-up
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            border-radius: 10px;
            width: 90%;
            max-width: 500px;
        `;
        popup.innerHTML = `
            <div style="display: flex; gap: 10px; margin-bottom: 20px; justify-content: center;">
                ${images.map((img, i) => `
                    <div>
                        <img src="${img.image}" alt="Captcha ${i + 1}" style="cursor: pointer; border-radius: 5px; width: 100px; height: 100px;">
                    </div>
                `).join('')}
            </div>
            <div style="text-align: center; color: #666; margin-bottom: 20px;">
                Toque na imagem que corresponde à frase correta
            </div>
        `;
        document.body.appendChild(popup);

        // Configura o evento de toque nas imagens
        images.forEach((img, i) => {
            const imageElement = popup.querySelector(`img[alt="Captcha ${i + 1}"]`);
            imageElement.addEventListener('click', async () => {
                // Envia o token AES da imagem selecionada para o servidor
                alert("Arquivo captcha.js não configurado, abra o arquivo 'captcha.js' em seu servidor, e altere as informações pedidas no arquivo.")
                const validationResponse = await fetch('http://URL_DO_SEU_SITE_AQUI/validate_captcha', { // Substitua URL_DO_SEU_SITE_AQUI pelo endereço do seu site, exemplo: 'http://127.0.0.1/validate_captcha' para localhost.
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include', // Inclui cookies na requisição
                    body: JSON.stringify({ token: img.token }), // Envia o token AES da imagem selecionada
                });
                const { valid } = await validationResponse.json();

                if (valid) {
                    badge.style.backgroundColor = '#28a745'; /* Verde para sucesso */
                    badge.innerHTML = 'Autorizado!';
                    alert('Captcha válido!');
                } else {
                    badge.style.backgroundColor = '#dc3545'; /* Vermelho para erro */
                    badge.innerHTML = 'Login não autorizado, tente novamente.';
                    alert('Captcha inválido!');
                }
                document.body.removeChild(popup);
            });
        });
    });
})();
