# Sistema de Controle Financeiro

<img src="https://res.cloudinary.com/dnuhmdhlu/image/upload/v1716316865/controle-financeiro_pxw72y.jpg" width="200"/>

## Sobre o Projeto:
Projeto baseado no desafio do módulo 3 do curso de [Desenvolvimento de Software](https://cubos.academy/cursos/desenvolvimento-de-software) com foco em Backend da [Cubos Academy](https://cubos.academy/), com melhorias adicionais. O objetivo foi criar uma aplicação de controle financeiro onde os usuários podem criar seus perfis e cadastrar transações, facilitando o acompanhamento e o controle de suas finanças pessoais.

## Índice:
* [Instalação e configuração](#instalação-e-configuração)
* [Funcionalidades e demonstração da aplicação](#funcionalidades-e-demonstração-da-aplicação)
* [Tecnologias utilizadas](#tecnologias-utilizadas)

## Instalação e configuração:
### Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas: [Node.js](https://nodejs.org/en/download/package-manager/current), [Git](https://git-scm.com/downloads), [VSCode](https://code.visualstudio.com/download), [PostgreSQL](https://www.postgresql.org/download/) e o [Beekeeper Studio](https://www.beekeeperstudio.io/get-community)

### Agora é só seguir os seguintes passos:
1. Faça o fork desse repositório para o seu perfil do Github.
2. Clone o seu repositório em sua máquina:
```bash
git clone git@github.com:seu-perfil/API-controle-financeiro.git
```
3. Acesse a pasta do projeto:
```bash
cd API-controle-financeiro
```
4. Renomei o arquivo .env.example para .env ou crie um arquivo .env na raiz do projeto e preencha as variáveis de ambiente:
```javaScript
PGDATABASE= nome-do-banco-de-dados-que-sera-utilizado
PGUSER= nome-de-usuario-do-postgresql
PGPASSWORD= senha-do-usuario-do-postgresql
PGHOST= endereco-do-servidor-postgresql
PGPORT= porta-do-servidor-postgresql

JWT_SECRET_KEY= chave-secreta-para-assinar-token-jwt
```
5. Instale as dependências do projeto:
```bash
npm install
```
6. Execute a aplicação:
```bash
npm run dev
```
## Funcionalidades e demonstração da aplicação:
Essa aplicação tem as seguintes funcionaidades:
* [Cadastrar Usuário](#cadastrar-usuário)
* [Fazer Login](#fazer-login)
* [Detalhar Perfil do Usuário Logado](#detalhar-perfil-do-usuário-logado)
* [Editar Perfil do Usuário Logado](#editar-perfil-do-usuário-logado)
* [Listar categorias](#listar-categorias)
* [Listar transações](#listar-transações)
* [Detalhar transação](#detalhar-transação)
* [Cadastrar transação](#cadastrar-transação)
* [Editar transação](#editar-transação)
* [Remover transação](#remover-transação)
* [Obter extrato de transações](#obter-extrato-de-transações)

### Cadastrar Usuário
#### `POST` `/usuario`
Essa é a rota que será utilizada para cadastrar um novo usuário no sistema. 
#### Exemplo da requisição:
```javascript
{
	"nome": "José Mario",
	"email": "josemario@email.com",
	"senha": "!@#12Jose"
}
```
#### *_lembrando que a senha é criptografada antes de ser cadastrada no banco de dados._*
#### Resposta:
```javascript
{
	"id": 1,
	"nome": "José Mario",
	"email": "josemario@email.com"
}
```

### Fazer login
#### `POST` `/login`
Essa é a rota que permite o usuário cadastrado realizar o login no sistema.
#### Exemplo da requisição:
```javascript
{
	"email": "josemario@email.com",
	"senha": "!@#12Jose"
}
```
#### Resposta:
```javascript
{
	"usuario": {
		"id": 1,
		"nome": "José Mario",
		"email": "josemario@email.com"
	},
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE2NDgxMDg2fQ.ymzLHE2yr0ApugOzaZn9NQdjRNkbGpXgyPGnstATyA4"
}
```

## **Importante:** Todas as funcionalidades abaixo serão exigidas um token de autenticação do usuário logado. Portanto, é necessário informar o token para ter acesso a elas.

### Detalhar Perfil do Usuário Logado
#### `GET` `/usuario`
Essa é a rota que será chamada quando o usuário quiser obter os dados do seu próprio perfil.
#### Resposta:
``` javascript
{
	"id": 1,
	"nome": "José Mario",
	"email": "josemario@email.com"
}
```

### Editar Perfil do Usuário Logado
#### `PUT` `/usuario`
Essa é a rota que será chamada quando o usuário quiser realizar alterações no seu próprio perfil.
#### Exemplo da requisição:
```javascript
{
	"nome": "Jose Mario Silva",
	"email": "josemariosilva@email.com",
	"senha": "!@#12JoseMa"
}
```
#### Resposta:
```javascript
// No body returned for response
```

### Listar Categorias
#### `GET` `/categoria`
Essa é a rota que será chamada quando o usuário logado quiser listar todas as categorias cadastradas.
#### Resposta: (_Existem mais categorias cadastradas, mas estas são apenas para exemplificar a resposta._)
``` javascript
[
	{
		"id": 1,
		"descricao": "Alimentação"
	},
	{
		"id": 2,
		"descricao": "Assinaturas e Serviços"
	},
	{
		"id": 3,
		"descricao": "Casa"
	},
];
```

### Listar Transações
#### `GET` `/transacao`
Essa é a rota que será chamada quando o usuário logado quiser listar todas as suas transações cadastradas.
#### Resposta:
``` javascript
[
	{
		"id": 1,
		"tipo": "entrada",
		"descricao": "Salário acabou de cair na conta",
		"valor": "300000",
		"data": "2024-05-23T03:00:00.000Z",
		"usuario_id": 1,
		"categoria_id": 14,
		"categoria_nome": "Salário"
	},
	{
		"id": 2,
		"tipo": "saida",
		"descricao": "Compra de camisa",
		"valor": "5000",
		"data": "2024-05-23T03:00:00.000Z",
		"usuario_id": 1,
		"categoria_id": 11,
		"categoria_nome": "Roupas"
	}
]
```

### Detalhar Transação
#### `GET` `/transacao:id`
Essa é a rota que será chamada quando o usuário logado quiser obter uma das suas transações cadastradas.
#### Resposta:
``` javascript
[
	{
		"id": 1,
		"tipo": "entrada",
		"descricao": "Salário acabou de cair na conta",
		"valor": "300000",
		"data": "2024-05-23T03:00:00.000Z",
		"usuario_id": 1,
		"categoria_id": 14,
		"categoria_nome": "Salário"
	}
]
```

### Cadastrar Transação
#### `POST` `/transacao`
Essa é a rota que será utilizada para cadastrar uma transação associada ao usuário logado.
#### Exemplo da requisição:
```javascript
{
	"descricao": "Salário caiu na conta",
	"valor": 300000,
	"categoria_id": "14",
	"tipo": "entrada"
}
```
#### Resposta:
``` javascript
{
	"id": 1,
	"tipo": "entrada",
	"descricao": "Salário caiu na conta",
	"valor": "300000",
	"data": "2024-05-23T03:00:00.000Z",
	"usuario_id": 1,
	"categoria_id": 14,
	"categoria_nome": "Salário"
}
```

### Editar Transação
#### `PUT` `/transacao:id`
Essa é a rota que será chamada quando o usuário logado quiser atualizar uma das suas transações cadastradas.
#### Exemplo de requisição:
``` javascript
{
	"descricao": "Salário acabou de cair na conta",
	"valor": 300000,
	"categoria_id": "14",
	"tipo": "entrada"
}
```
#### Resposta:
``` javascript
// No body returned for response
```
### Remover Transação
#### `DELETE` `/transacao:id`
Essa é a rota que será chamada quando o usuário logado quiser excluir uma das suas transações cadastradas.
#### Resposta:
``` javascript
// No body returned for response
```

### Obter extrato de transações
#### `GET` `/transacao/extrato`
Essa é a rota que será chamada quando o usuário logado quiser obter o extrato de todas as suas transações cadastradas
#### Resposta:
``` javascript
{
	"entrada": {
		"total": "300000",
		"transacoes": [
			{
				"id": 1,
				"descricao": "Salário acabou de cair na conta",
				"valor": "300000",
				"data": "2024-05-23T03:00:00.000Z",
				"categoria_id": 14,
				"usuario_id": 1,
				"tipo": "entrada"
			}
		]
	},
	"saida": {
		"total": "5000",
		"transacoes": [
			{
				"id": 2,
				"descricao": "Compra de camisa",
				"valor": "5000",
				"data": "2024-05-23T03:00:00.000Z",
				"categoria_id": 11,
				"usuario_id": 1,
				"tipo": "saida"
			}
		]
	}
}
```

## Tecnologias utilizadas:
* JavaScript
* Node.js
* Express
* PostgreSQL

## Licença
Feito com ❤️ por Vanessa Ribeiro

