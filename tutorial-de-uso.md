# Tutorial de Uso - HsyCaptcha
Aqui, você vai aprender como baixar, instalar, hospedar, e testar o HsyCaptcha!

# Primeira sessão - Baixar aplicação
--------------
## Requisitos
- [NPM e Nodejs](https://nodejs.org/en/download)
- [HsyCaptcha](https://github.com/Hsyst/HsyCaptcha/releases)


# Segunda sessão - Realizar a instalação
## Passo 1
Abra o CMD/Terminal na pasta onde contém o arquivo [index.js](https://github.com/Hsyst/HsyCaptcha/blob/main/index.js)

## Passo 2
Baixe as dependencias do HsyCaptcha
```
npm install
```

## Passo 3
Abra o [index.js](https://github.com/Hsyst/HsyCaptcha/blob/main/index.js) e altere as linhas:

- Linha 23
- Linha 7

## Passo 4
Abra o [captcha.js](https://github.com/Hsyst/HsyCaptcha/blob/main/www/captcha.js) e altere as linhas:

- Altere as linhas: 10, 64, 106 de `URL_DO_SEU_SITE_AQUI` para `localhost:3001` (isso apenas para testes locais)
- Remova as linhas que conterem: `alert("Arquivo captcha.js não configurado, abra o arquivo 'captcha.js' em seu servidor, e altere as informações pedidas no arquivo.")`

## Passo 5
Crie um arquivo em [www/](https://github.com/Hsyst/HsyCaptcha/tree/main/www) chamado captcha-test.html e adicionar o seguinte conteúdo nele: [clique aqui](https://github.com/Hsyst/HsyCaptcha/tree/main#script-default)

- Altere as linhas do arquivo que acabou de criar
- Linhas: 30, 57

## Passo 6
Rode o servidor
```
npm run main
```

## Passo 7
Abra em seu navegador: `http://localhost:3001`

## Passo 8
Caso ao abrir a url em seu navegador, tenha aberto uma página, abra a url: `http://localhost:3001/captcha-test.html`

## Passo 8.1
Caso a URL dê algum erro, ou não abra, verifique se criou o arquivo. Caso tenha dado certo, você instalou com sucesso!

# Fim!
Pronto, agora o HsyCaptcha já está rodando em sua máquina!
