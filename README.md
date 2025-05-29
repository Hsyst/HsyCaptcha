# HsyCaptcha
## Idealizado por [Kael](https://github.com/oimeu)
## Programado por [op3n](https://github.com/op3ny)

# Tutorial de Uso
Caso você queira apenas instalar o HsyCaptcha, [Clique Aqui!](https://github.com/Hsyst/HsyCaptcha/blob/main/tutorial-de-uso.md)

# Documentação técnica - HsyCaptcha
Na documentação técnica, você vai ver como o HsyCaptcha funciona, com uma linguagem técnica. Caso você queira realizar modificações mais a fundo, ou simplesmente conhecer um pouco mais do projeto, continue aqui.

# Índice

- Índice
- Endpoints
  - Gerar captcha (POST) - /gen_captcha
  - Validar captcha (POST) - /validate_captcha
  - Verificar se o usuário já fez o captcha (GET) - /check_authorization
  - Invalidar o captcha (POST) - /invalidate_captcha
- Ajustes possiveis
- Script default
- CORS
- Finalização
- Créditos

# Endpoints
O nosso captcha, ele tem poucos endpoints. Apenas o suficiente para seu funcionamento, já que o objetivo dele é ser algo leve, mas ao mesmo tempo, gratis e Open Source.

## Gerar captcha (POST) - /gen-captcha
- Requisição: POST
- Envio de dados: `null` (não é necessário enviar dados)

Exemplo de envio: `https://seusiteaqui.exemplo/gen-captcha`
Exemplo de resposta: `{"images":[{"image":"data:image/png;","token":"f9b2d2049ad3925265090d2865fa1a58"},{"image":"data:image/png;","token":"f742f3f829a96e45d6c4d57fded92d1f"}]}`

## Validar captcha (POST) - /validate_captcha
- Requsição: POST
- Envio de dados: `Corpo da Requisição` (`const { token } = req.body;`)
- O que enviar: `Token da imagem do captcha selecionado` (E.x: `token="f9b2d2049ad3925265090d2865fa1a58"`)
- Exemplo de resposta: `{"valid":true}`

## Verificar se o usuário já fez o captcha (GET) - /check_authorization
- Requisição: GET
- Envio de dados: `null` (Não é necessário o envio de nenhum dado)
- Exemplo de resposta: `{"authorized":true}`

## Invalidar o captcha (POST) - /invalidate_captcha
- Requisição: POST
- Envio de dados: `null` (Não é necessário o envio de nenhum dado)
- Exemplo de resposta: `{"success":true,"message":"Autorização do captcha invalidada com sucesso."}`

# Ajustes possiveis
Este script tem algumas alterações possiveis, que você pode alterar de acordo com o que achar útil.

[index.js](https://github.com/Hsyst/HsyCaptcha/blob/main/index.js)

- Linhas 10, 11, 12, 13, 14, 15, 16, 17
Configuração de CORS.

- Linha 23
Configuração da secret. (Recomendado a alteração)

- Linha 51-68 (de 51 a 68)
Opções de palavras pro captcha.

- Linha 7
Porta ao qual o serviço está rodando.

# Script default
Para integrar o captcha a sua página de login, por exemplo, você pode usar como base o script abaixo:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teste de Captcha</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
        }
        .success {
            color: green;
        }
        .error {
            color: red;
        }
    </style>
</head>
<body>
    <h1 id="message">Resolva o captcha para continuar</h1>
    <div id="captcha-container"></div>
    <script src="/captcha.js"></script>
    <button id="bt-verificar" class="text-sm text-primary hover:text-secondary transition-all duration-300"> Verificar captcha </button>
    
    <script>
        async function checkAuthorization() {
            try {
                const response = await fetch('http://localhost:3001/check_authorization', {
                    method: 'GET',
                    credentials: 'include',
                });
                
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                return data.authorized ?? false;
            } catch (error) {
                console.error('Erro ao verificar autorização:', error);
                return false;
            }
        }

        document.getElementById('bt-verificar').addEventListener("click", async function () {
            const messageElement = document.getElementById('message');
            messageElement.textContent = 'Verificando...';
            messageElement.className = '';
            
            const isAuthorized = await checkAuthorization();
            
            if (isAuthorized) {
                messageElement.textContent = 'Sucesso!';
                messageElement.className = 'success';
                await fetch('http://localhost:3001/invalidate_captcha', {
                    method: 'POST',
                    credentials: 'include', // Inclui cookies na requisição
                });
            } else {
                messageElement.textContent = 'Tente Novamente';
                messageElement.className = 'error';
            }
        });
    </script>
</body>
</html>
```

# CORS
Nas linha 12-15 (12 a 15) você tem a configuração de cors já definida, basta descomentar!

# Finalização
Agradecemos pela escolha do HsyCaptcha, e caso você tenha gostado do projeto, considere acessar o [nosso site!](https://hsyst.xyz)

# Créditos
- [op3n](https://github.com/op3ny) - Criação, penterest e desenvolvimento do projeto.
- [Kael](https://github.com/oimeu) - Idealização
