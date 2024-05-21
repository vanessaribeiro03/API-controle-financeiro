# Sistema de Controle Financeiro

<img src="https://res.cloudinary.com/dnuhmdhlu/image/upload/v1716316865/controle-financeiro_pxw72y.jpg" width="200"/>

## Sobre o Projeto:
Projeto baseado no desafio do módulo 3 do curso de [Desenvolvimento de Software](https://cubos.academy/cursos/desenvolvimento-de-software) com foco em Backend da turma B2B T10 da [Cubos Academy](https://cubos.academy/), com melhorias adicionais. O objetivo foi criar uma aplicação de controle financeiro onde os usuários podem criar seus perfis e cadastrar transações, facilitando o acompanhamento e o controle de suas finanças pessoais.

## Índice:
* [Instalaçao e configuração](#instalação-e-configuração)
* [Funcionalidades e demonstração da aplicação]
* [Tecnologias utilizadas]

## Instalação e configuração:
### Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas: [Node.js](https://nodejs.org/en/download/package-manager/current), [Git](https://git-scm.com/downloads), [VSCode](https://code.visualstudio.com/download), [PostgreSQL](https://www.postgresql.org/download/) e o [Beekeeper Studio](https://www.beekeeperstudio.io/get-community)

### Agora é só seguir os seguintes passos:
1. Faça o fork desse repositório para o seu perfil do Github
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


