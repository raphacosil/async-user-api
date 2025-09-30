# Projeto Node + Sequelize + MySQL

## Descrição

Aplicação simples em Node.js usando **Express**, **Handlebars** e **Sequelize** para gerenciar usuários e endereços.
Implementa operações de **CRUD** e renderização de páginas dinâmicas.

---

## Tecnologias utilizadas

* Node.js
* Express
* Express-Handlebars
* Sequelize
* MySQL
* Nodemon (para desenvolvimento)

---

## Estrutura básica

```
index.js              # Entrada principal
db/conn.js            # Conexão com banco MySQL
models/User.js        # Modelo de usuário
models/Address.js     # Modelo de endereço
views/                # Templates Handlebars
public/css/styles.css # Arquivo de estilos
```

---

## Banco de dados

Crie o banco no MySQL:

```sql
CREATE DATABASE nodesequelize CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nodesequelize;
```

> Certifique-se de atualizar as credenciais de usuário e senha no arquivo `db/conn.js`.

---

## Instalação e execução

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd <nome-da-pasta>
```

2. Instale as dependências:

```bash
npm install
```

3. Configure a conexão com o banco em `db/conn.js`.

4. Inicie o projeto em modo desenvolvimento:

```bash
npm run dev
```

5. Abra o navegador no endereço padrão:

```
http://localhost:3000
```

> Durante o desenvolvimento, o **nodemon** reinicia o servidor automaticamente ao salvar alterações.

---

## Rotas principais

* `/` → Lista de usuários
* `/users/create` → Formulário para adicionar usuário
* `/users/:id` → Detalhes de um usuário
* `/users/edit/:id` → Edição de usuário

---

## Observações

* Os modelos do Sequelize criam automaticamente as tabelas se não existirem.
* Handlebars é usado para renderizar as views.
* Para produção, configure variáveis de ambiente e desative `nodemon`.
