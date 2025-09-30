# Roteiro do Aluno: Conectando Node.js com MySQL usando Sequelize

## Objetivo do Projeto

Aprender a criar uma aplicação web completa usando Node.js, Express, MySQL e Sequelize para gerenciar usuários e seus endereços.

## O que vamos construir?

- Uma aplicação web para cadastrar usuários
- Sistema CRUD (Create, Read, Update, Delete) completo
- Relacionamento entre tabelas (Usuário → Endereços)
- Interface visual usando Handlebars

---

## Pré-requisitos

- Node.js instalado
- MySQL Server e MySQL Workbench
- Editor de código (VSCode recomendado)
- Conhecimento básico de HTML, CSS e JavaScript

---

## PARTE 1: CONFIGURAÇÃO INICIAL

### Passo 1: Criando o Projeto

**O que vamos fazer:** Inicializar um novo projeto Node.js e instalar as dependências necessárias.

1. Crie uma pasta para o projeto:

```bash
mkdir meu-projeto-sequelize
cd meu-projeto-sequelize
```

2. Inicialize o package.json:

```bash
npm init -y
```

3. Instale as dependências principais:

```bash
npm install express express-handlebars mysql2 sequelize
```

4. Instale o nodemon para desenvolvimento:

```bash
npm install nodemon --save-dev
```

**Explicação:**

- `express`: Framework web para Node.js
- `express-handlebars`: Motor de templates para criar páginas HTML
- `mysql2`: Driver para conectar com MySQL
- `sequelize`: ORM (Object-Relational Mapping) para facilitar trabalho com banco de dados
- `nodemon`: Reinicia automaticamente o servidor quando há mudanças no código

---

### Passo 2: Estrutura de Pastas

**O que vamos fazer:** Organizar nosso projeto em pastas lógicas.

Crie a seguinte estrutura de pastas e arquivos:

```
meu-projeto-sequelize/
├── index.js
├── package.json
├── public/
│   └── css/
│       └── styles.css
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── home.handlebars
│   ├── adduser.handlebars
│   ├── userview.handlebars
│   └── useredit.handlebars
├── db/
│   └── conn.js
└── models/
    ├── User.js
    └── Address.js
```

**Explicação da estrutura:**

- `index.js`: Arquivo principal da aplicação
- `public/`: Arquivos estáticos (CSS, imagens, JS do front-end)
- `views/`: Templates Handlebars para as páginas
- `db/`: Configuração da conexão com o banco
- `models/`: Definição das tabelas/modelos do banco

---

## PARTE 2: INTERFACE E LAYOUT

### Passo 3: Layout Principal

**O que vamos fazer:** Criar o template base que será usado em todas as páginas.

Arquivo: `views/layouts/main.handlebars`

```html
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sistema de Usuários - Sequelize</title>
    <link rel="stylesheet" href="/css/styles.css" />
  </head>
  <body>
    <nav id="navbar">
      <div class="nav-brand">
        <h2>Sistema de Usuários</h2>
      </div>
      <ul>
        <li><a href="/">Listar Usuários</a></li>
        <li><a href="/users/create">Cadastrar Usuário</a></li>
      </ul>
    </nav>
    <main class="container">
      {{{ body }}}
    </main>
  </body>
</html>
```

**Explicação:**

- Este é o layout base que envolve todas as páginas
- `{{{ body }}}` é onde o conteúdo específico de cada página será inserido
- A navegação permite acesso rápido às principais funcionalidades

---

### Passo 4: Página Inicial - Lista de Usuários

**O que vamos fazer:** Criar a página que mostra todos os usuários cadastrados.

Arquivo: `views/home.handlebars`

```html
<div class="page-header">
  <h1>Usuários Cadastrados</h1>
  <a href="/users/create" class="btn btn-primary">Adicionar Novo Usuário</a>
</div>

{{#if users}}
<div class="users-grid">
  {{#each users}}
    <div class="user-card">
      <div class="user-info">
        <h3>{{this.name}}</h3>
        <p class="occupation">{{this.occupation}}</p>
        <p class="newsletter">
          {{#if this.newsletter}}
             Recebe newsletter
          {{else}}
            Não recebe newsletter
          {{/if}}
        </p>
      </div>
      <div class="user-actions">
        <a href="/users/{{this.id}}" class="btn btn-info">Ver</a>
        <a href="/users/edit/{{this.id}}" class="btn btn-warning">Editar</a>
        <form action="/users/delete/{{this.id}}" method="POST" class="delete-form">
          <button type="submit" class="btn btn-danger" onclick="return confirm('Tem certeza que deseja excluir este usuário?')">
            Excluir
          </button>
        </form>
      </div>
    </div>
  {{/each}}
</div>
{{else}}
<div class="empty-state">
  <h3>Nenhum usuário cadastrado ainda</h3>
  <p>Que tal adicionar o primeiro usuário?</p>
  <a href="/users/create" class="btn btn-primary">Cadastrar Primeiro Usuário</a>
</div>
{{/if}}
```

**Explicação:**

- `{{#if users}}` verifica se existem usuários para mostrar
- `{{#each users}}` percorre todos os usuários
- Cada usuário tem botões para ver, editar e excluir
- Se não há usuários, mostra uma mensagem amigável

---

### Passo 5: Estilização CSS

**O que vamos fazer:** Dar uma aparência profissional à nossa aplicação.

Arquivo: `public/css/styles.css`

```css
/* Reset e configurações globais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

/* Navegação */
#navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-brand h2 {
  font-weight: 300;
}

#navbar ul {
  display: flex;
  list-style: none;
  gap: 1rem;
}

#navbar a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.3s;
}

#navbar a:hover {
  background-color: rgba(255,255,255,0.2);
}

/* Container principal */
.container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

/* Cabeçalho das páginas */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.page-header h1 {
  color: #495057;
  font-weight: 300;
}

/* Botões */
.btn {
  display: inline-block;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-warning {
  background-color: #ffc107;
  color: #212529;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

/* Grid de usuários */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.user-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.user-info h3 {
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.user-info p {
  margin-bottom: 0.3rem;
  color: #6c757d;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.delete-form {
  display: inline;
}

/* Estado vazio */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.empty-state h3 {
  color: #6c757d;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #adb5bd;
  margin-bottom: 2rem;
}

/* Formulários */
.form {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #495057;
}

.form-control {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e9ecef;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-checkbox input[type="checkbox"] {
  width: auto;
  transform: scale(1.2);
}

/* Seção de endereços */
.address-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e9ecef;
}

.address-form {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.address-list {
  margin-top: 1.5rem;
}

.address-item {
  background: white;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.address-info {
  flex: 1;
}

.address-info strong {
  color: #495057;
}

/* Página de detalhes */
.user-details {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}

/* Responsividade */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  #navbar {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .users-grid {
    grid-template-columns: 1fr;
  }
  
  .user-actions {
    justify-content: center;
  }
  
  .address-item {
    flex-direction: column;
    gap: 1rem;
  }
}
```

**Explicação:**

- Design moderno com gradientes e sombras
- Responsivo para diferentes tamanhos de tela
- Estados de hover para melhor experiência do usuário
- Grid layout para organizar os cards de usuários

---

## PARTE 3: BANCO DE DADOS E CONEXÃO

### Passo 6: Criando o Banco de Dados

**O que vamos fazer:** Configurar o banco de dados MySQL.

1. **Abra o MySQL Workbench**
2. **Execute o comando SQL:**

```sql
CREATE DATABASE nodesequelize CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nodesequelize;
```

**Explicação:**

- `CHARACTER SET utf8mb4`: Suporte completo para caracteres Unicode
- `COLLATE utf8mb4_unicode_ci`: Regras de comparação de texto

---

### Passo 7: Configuração da Conexão

**O que vamos fazer:** Criar a conexão entre nossa aplicação e o MySQL.

Arquivo: `db/conn.js`

```javascript
const { Sequelize } = require('sequelize');

// Configuração da conexão com o banco de dados
const sequelize = new Sequelize('nodesequelize', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log, // Mostra as queries SQL no console
  define: {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    underscored: false, // Usa camelCase ao invés de snake_case
  },
  pool: {
    max: 10, // Máximo de conexões simultâneas
    min: 0,  // Mínimo de conexões
    acquire: 30000, // Tempo máximo para obter conexão (30s)
    idle: 10000, // Tempo máximo que uma conexão pode ficar inativa (10s)
  },
});

// Função para testar a conexão
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com MySQL estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error.message);
  }
}

testConnection();

module.exports = sequelize;
```

**Explicação:**

- `pool`: Gerencia o pool de conexões para melhor performance
- `logging`: Permite ver as queries SQL executadas
- `authenticate()`: Testa se a conexão está funcionando

---

## PARTE 4: MODELOS (TABELAS)

### Passo 8: Modelo de Usuário

**O que vamos fazer:** Definir a estrutura da tabela de usuários.

Arquivo: `models/User.js`

```javascript
const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome não pode estar vazio'
      },
      len: {
        args: [2, 100],
        msg: 'Nome deve ter entre 2 e 100 caracteres'
      }
    }
  },
  occupation: {
    type: DataTypes.STRING(150),
    allowNull: true,
    validate: {
      len: {
        args: [0, 150],
        msg: 'Profissão deve ter no máximo 150 caracteres'
      }
    }
  },
  newsletter: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
}, {
  tableName: 'users',
  indexes: [
    {
      fields: ['name'] // Índice para busca por nome
    }
  ]
});

module.exports = User;
```

**Explicação:**

- `validate`: Regras de validação dos dados
- `indexes`: Melhora performance de buscas
- `tableName`: Nome específico da tabela no banco

---

### Passo 9: Modelo de Endereço

**O que vamos fazer:** Criar a tabela de endereços relacionada aos usuários.

Arquivo: `models/Address.js`

```javascript
const { DataTypes } = require('sequelize');
const db = require('../db/conn');
const User = require('./User');

const Address = db.define('Address', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  street: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Rua não pode estar vazia'
      },
      len: {
        args: [5, 200],
        msg: 'Rua deve ter entre 5 e 200 caracteres'
      }
    }
  },
  number: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      len: {
        args: [0, 20],
        msg: 'Número deve ter no máximo 20 caracteres'
      }
    }
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Cidade não pode estar vazia'
      },
      len: {
        args: [2, 100],
        msg: 'Cidade deve ter entre 2 e 100 caracteres'
      }
    }
  },
}, {
  tableName: 'addresses',
});

// Definindo relacionamentos
Address.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Address, {
  foreignKey: 'userId',
  as: 'addresses'
});

module.exports = Address;
```

**Explicação dos Relacionamentos:**

- `Address.belongsTo(User)`: Um endereço pertence a um usuário
- `User.hasMany(Address)`: Um usuário pode ter vários endereços
- `foreignKey`: Define o nome da chave estrangeira
- `as`: Alias para usar nas consultas

---

## PARTE 5: SERVIDOR E ROTAS

### Passo 10: Configuração do Servidor Principal

**O que vamos fazer:** Criar o arquivo principal que irá gerenciar todas as rotas.

Arquivo: `index.js`

```javascript
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

// Importando conexão e modelos
const conn = require('./db/conn');
const User = require('./models/User');
const Address = require('./models/Address');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Handlebars
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsing de dados
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de log das requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===============================
// ROTAS PRINCIPAIS
// ===============================

// Página inicial - Lista todos os usuários
app.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']], // Mais recentes primeiro
      raw: true
    });
  
    console.log(`Encontrados ${users.length} usuários`);
    res.render('home', { users });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.render('home', { 
      users: [], 
      error: 'Erro ao carregar usuários' 
    });
  }
});

// ===============================
// ROTAS DE USUÁRIOS
// ===============================

// Página de cadastro de usuário
app.get('/users/create', (req, res) => {
  res.render('adduser');
});

// Criar novo usuário
app.post('/users/create', async (req, res) => {
  try {
    const { name, occupation, newsletter } = req.body;
  
    // Validação básica
    if (!name || name.trim().length < 2) {
      return res.render('adduser', { 
        error: 'Nome deve ter pelo menos 2 caracteres',
        formData: { name, occupation, newsletter }
      });
    }

    const userData = {
      name: name.trim(),
      occupation: occupation ? occupation.trim() : null,
      newsletter: newsletter === 'on'
    };

    const user = await User.create(userData);
    console.log('Usuário criado:', user.toJSON());
  
    res.redirect('/');
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.render('adduser', { 
      error: 'Erro ao criar usuário: ' + error.message,
      formData: req.body
    });
  }
});

// Ver detalhes de um usuário
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
  
    const user = await User.findByPk(id, {
      include: [{
        model: Address,
        as: 'addresses'
      }]
    });

    if (!user) {
      return res.render('userview', { 
        error: 'Usuário não encontrado' 
      });
    }

    res.render('userview', { 
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.render('userview', { 
      error: 'Erro ao carregar usuário' 
    });
  }
});

// Página de edição de usuário
app.get('/users/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
  
    const user = await User.findByPk(id, {
      include: [{
        model: Address,
        as: 'addresses',
        order: [['createdAt', 'DESC']]
      }]
    });

    if (!user) {
      return res.redirect('/');
    }

    res.render('useredit', { 
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Erro ao buscar usuário para edição:', error);
    res.redirect('/');
  }
});

// Atualizar usuário
app.post('/users/update', async (req, res) => {
  try {
    const { id, name, occupation, newsletter } = req.body;
  
    // Validação
    if (!name || name.trim().length < 2) {
      return res.redirect(`/users/edit/${id}`);
    }

    const updateData = {
      name: name.trim(),
      occupation: occupation ? occupation.trim() : null,
      newsletter: newsletter === 'on'
    };

    const [updatedRows] = await User.update(updateData, {
      where: { id }
    });

    if (updatedRows === 0) {
      console.log('Nenhum usuário foi atualizado');
    } else {
      console.log(`Usuário ${id} atualizado com sucesso`);
    }

    res.redirect('/');
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.redirect(`/users/edit/${req.body.id || ''}`);
  }
});

// Excluir usuário
app.post('/users/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
  
    // Primeiro, deletar todos os endereços do usuário
    await Address.destroy({
      where: { userId: id }
    });
  
    // Depois, deletar o usuário
    const deletedRows = await User.destroy({
      where: { id }
    });

    if (deletedRows > 0) {
      console.log(`Usuário ${id} e seus endereços foram excluídos`);
    } else {
      console.log('Nenhum usuário foi excluído');
    }

    res.redirect('/');
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.redirect('/');
  }
});

// ===============================
// ROTAS DE ENDEREÇOS
// ===============================

// Criar novo endereço
app.post('/address/create', async (req, res) => {
  try {
    const { userId, street, number, city } = req.body;
  
    // Validação
    if (!street || street.trim().length < 5) {
      return res.redirect(`/users/edit/${userId}`);
    }
  
    if (!city || city.trim().length < 2) {
      return res.redirect(`/users/edit/${userId}`);
    }

    const addressData = {
      street: street.trim(),
      number: number ? number.trim() : null,
      city: city.trim(),
      userId
    };

    const address = await Address.create(addressData);
    console.log('Endereço criado:', address.toJSON());
  
    res.redirect(`/users/edit/${userId}`);
  } catch (error) {
    console.error('Erro ao criar endereço:', error);
    res.redirect(`/users/edit/${req.body.userId || ''}`);
  }
});

// Excluir endereço
app.post('/address/delete', async (req, res) => {
  try {
    const { id, userId } = req.body;
  
    const deletedRows = await Address.destroy({
      where: { id }
    });

    if (deletedRows > 0) {
      console.log(`Endereço ${id} excluído`);
    }

    res.redirect(userId ? `/users/edit/${userId}` : '/');
  } catch (error) {
    console.error('Erro ao excluir endereço:', error);
    res.redirect('/');
  }
});

// ===============================
// TRATAMENTO DE ERROS 404
// ===============================
app.use((req, res) => {
  res.status(404).render('home', { 
    users: [],
    error: 'Página não encontrada' 
  });
});

// ===============================
// INICIALIZAÇÃO DO SERVIDOR
// ===============================
async function startServer() {
  try {
    // Sincronizar modelos com o banco de dados
    await conn.sync();
    console.log('Modelos sincronizados com o banco de dados!');
  
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log('Pressione Ctrl+C para parar o servidor');
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
```

**Explicação Detalhada:**

- **Middleware de log**: Registra todas as requisições
- **Tratamento de erros**: Try-catch em todas as operações
- **Validação**: Verificações básicas dos dados
- **Relacionamentos**: Inclui endereços ao buscar usuários
- **Feedback**: Console.log para acompanhar operações

---

## PARTE 6: PÁGINAS COMPLEMENTARES

### Passo 11: Página de Cadastro de Usuário

**O que vamos fazer:** Criar o formulário para adicionar novos usuários.

Arquivo: `views/adduser.handlebars`

```html
<div class="page-header">
  <h1>Cadastrar Novo Usuário</h1>
  <a href="/" class="btn btn-info">Voltar para Lista</a>
</div>

{{#if error}}
<div class="alert alert-error">
  {{error}}
</div>
{{/if}}

<form action="/users/create" method="POST" class="form">
  <div class="form-group">
    <label for="name">Nome Completo *</label>
    <input 
      type="text" 
      id="name"
      name="name" 
      class="form-control"
      placeholder="Digite o nome completo do usuário"
      value="{{formData.name}}"
      required
      minlength="2"
      maxlength="100"
    />
    <small class="form-text">Mínimo de 2 caracteres</small>
  </div>

  <div class="form-group">
    <label for="occupation">Profissão</label>
    <input 
      type="text" 
      id="occupation"
      name="occupation" 
      class="form-control"
      placeholder="Digite a profissão (opcional)"
      value="{{formData.occupation}}"
      maxlength="150"
    />
    <small class="form-text">Campo opcional</small>
  </div>

  <div class="form-group">
    <div class="form-checkbox">
      <input 
        type="checkbox" 
        id="newsletter"
        name="newsletter" 
        {{#if formData.newsletter}}checked{{/if}}
      />
      <label for="newsletter">Deseja receber nossa newsletter?</label>
    </div>
    <small class="form-text">Você pode alterar essa opção a qualquer momento</small>
  </div>

  <div class="form-actions">
    <button type="submit" class="btn btn-primary">Cadastrar Usuário</button>
    <a href="/" class="btn btn-secondary">Cancelar</a>
  </div>
</form>

<style>
.alert {
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.alert-error {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

@media (max-width: 600px) {
  .form-actions {
    flex-direction: column;
  }
}
</style>
```

---

### Passo 12: Página de Visualização de Usuário

**O que vamos fazer:** Mostrar os detalhes completos de um usuário.

Arquivo: `views/userview.handlebars`

```html
{{#if error}}
<div class="alert alert-error">
  {{error}}
  <a href="/" class="btn btn-primary">Voltar para Lista</a>
</div>
{{else}}
<div class="page-header">
  <h1>Detalhes do Usuário</h1>
  <div class="header-actions">
    <a href="/" class="btn btn-info">Voltar</a>
    <a href="/users/edit/{{user.id}}" class="btn btn-warning">Editar</a>
  </div>
</div>

<div class="user-details">
  <div class="user-main-info">
    <h2>{{user.name}}</h2>
  
    <div class="info-grid">
      <div class="info-item">
        <strong>Profissão:</strong>
        <span>{{#if user.occupation}}{{user.occupation}}{{else}}Não informada{{/if}}</span>
      </div>
    
      <div class="info-item">
        <strong>Newsletter:</strong>
        <span class="newsletter-status {{#if user.newsletter}}active{{else}}inactive{{/if}}">
          {{#if user.newsletter}}
            Ativo
          {{else}}
            Inativo
          {{/if}}
        </span>
      </div>
    
      <div class="info-item">
        <strong>Cadastrado em:</strong>
        <span>{{formatDate user.createdAt}}</span>
      </div>
    
      {{#if user.updatedAt}}
      <div class="info-item">
        <strong>Última atualização:</strong>
        <span>{{formatDate user.updatedAt}}</span>
      </div>
      {{/if}}
    </div>
  </div>

  {{#if user.addresses}}
  <div class="addresses-section">
    <h3>Endereços ({{user.addresses.length}})</h3>
  
    {{#if user.addresses.length}}
    <div class="addresses-list">
      {{#each user.addresses}}
      <div class="address-card">
        <div class="address-info">
          <strong>{{this.street}}</strong>
          {{#if this.number}}, {{this.number}}{{/if}}
          <br>
          <span class="city">{{this.city}}</span>
        </div>
        <div class="address-actions">
          <span class="address-id">#{{this.id}}</span>
        </div>
      </div>
      {{/each}}
    </div>
    {{else}}
    <div class="empty-addresses">
      <p>Nenhum endereço cadastrado ainda</p>
      <a href="/users/edit/{{user.id}}" class="btn btn-primary">Adicionar Endereço</a>
    </div>
    {{/if}}
  </div>
  {{/if}}
  
  <div class="actions-section">
    <a href="/users/edit/{{user.id}}" class="btn btn-primary">Editar Usuário</a>
    <form action="/users/delete/{{user.id}}" method="POST" class="delete-form">
      <button type="submit" class="btn btn-danger" 
              onclick="return confirm('Tem certeza que deseja excluir este usuário?\n\nEsta ação não pode ser desfeita e também excluirá todos os endereços associados.')">
        Excluir Usuário
      </button>
    </form>
  </div>
</div>

<style>
.header-actions {
  display: flex;
  gap: 0.5rem;
}

.user-main-info {
  margin-bottom: 2rem;
}

.user-main-info h2 {
  color: #495057;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.info-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 5px;
  border-left: 4px solid #667eea;
}

.info-item strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
}

.newsletter-status.active {
  color: #28a745;
  font-weight: bold;
}

.newsletter-status.inactive {
  color: #dc3545;
  font-weight: bold;
}

.addresses-section {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.addresses-section h3 {
  color: #495057;
  margin-bottom: 1rem;
}

.addresses-list {
  display: grid;
  gap: 1rem;
}

.address-card {
  background: white;
  padding: 1rem;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.city {
  color: #6c757d;
  font-style: italic;
}

.address-id {
  background: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-size: 0.875rem;
  color: #6c757d;
}

.empty-addresses {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.actions-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid #e9ecef;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-section {
    flex-direction: column;
  }
  
  .address-card {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
{{/if}}
```

---

### Passo 13: Página de Edição com Endereços

**O que vamos fazer:** Criar a página mais complexa, que permite editar usuário e gerenciar endereços.

Arquivo: `views/useredit.handlebars`

```html
<div class="page-header">
  <h1>Editando: {{user.name}}</h1>
  <div class="header-actions">
    <a href="/users/{{user.id}}" class="btn btn-info">Ver Detalhes</a>
    <a href="/" class="btn btn-secondary"> Voltar para Lista</a>
  </div>
</div>

<!-- Formulário de Edição do Usuário -->
<div class="edit-container">
  <section class="user-edit-section">
    <h2>👤 Dados do Usuário</h2>
  
    <form action="/users/update" method="POST" class="form">
      <input type="hidden" name="id" value="{{user.id}}" />
    
      <div class="form-group">
        <label for="name">Nome Completo *</label>
        <input 
          type="text" 
          id="name"
          name="name" 
          class="form-control"
          placeholder="Digite o nome completo"
          value="{{user.name}}"
          required
          minlength="2"
          maxlength="100"
        />
      </div>

      <div class="form-group">
        <label for="occupation">Profissão</label>
        <input 
          type="text" 
          id="occupation"
          name="occupation" 
          class="form-control"
          placeholder="Digite a profissão"
          value="{{user.occupation}}"
          maxlength="150"
        />
      </div>

      <div class="form-group">
        <div class="form-checkbox">
          <input 
            type="checkbox" 
            id="newsletter"
            name="newsletter" 
            {{#if user.newsletter}}checked{{/if}}
          />
          <label for="newsletter">Receber newsletter</label>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Salvar Alterações</button>
      </div>
    </form>
  </section>

  <!-- Seção de Endereços -->
  <section class="addresses-section">
    <h2>Gerenciar Endereços</h2>
  
    <!-- Formulário para Adicionar Novo Endereço -->
    <div class="address-form-container">
      <h3>Adicionar Novo Endereço</h3>
    
      <form action="/address/create" method="POST" class="address-form">
        <input type="hidden" name="userId" value="{{user.id}}" />
      
        <div class="form-row">
          <div class="form-group">
            <label for="street">Rua/Avenida *</label>
            <input 
              type="text" 
              id="street"
              name="street" 
              class="form-control"
              placeholder="Digite o nome da rua"
              required
              minlength="5"
              maxlength="200"
            />
          </div>
        
          <div class="form-group">
            <label for="number">Número</label>
            <input 
              type="text" 
              id="number"
              name="number" 
              class="form-control"
              placeholder="Número"
              maxlength="20"
            />
          </div>
        </div>
      
        <div class="form-group">
          <label for="city">Cidade *</label>
          <input 
            type="text" 
            id="city"
            name="city" 
            class="form-control"
            placeholder="Digite a cidade"
            required
            minlength="2"
            maxlength="100"
          />
        </div>
      
        <button type="submit" class="btn btn-primary">Adicionar Endereço</button>
      </form>
    </div>

    <!-- Lista de Endereços Existentes -->
    <div class="addresses-list-container">
      <h3>Endereços Cadastrados ({{user.addresses.length}})</h3>
    
      {{#if user.addresses.length}}
      <div class="addresses-list">
        {{#each user.addresses}}
        <div class="address-item">
          <div class="address-info">
            <strong>{{this.street}}</strong>
            {{#if this.number}}, nº {{this.number}}{{/if}}
            <br>
            <span class="city">{{this.city}}</span>
            <small class="address-meta">ID: #{{this.id}}</small>
          </div>
        
          <div class="address-actions">
            <form action="/address/delete" method="POST" class="delete-form">
              <input type="hidden" name="id" value="{{this.id}}" />
              <input type="hidden" name="userId" value="{{../user.id}}" />
              <button 
                type="submit" 
                class="btn btn-danger btn-sm"
                onclick="return confirm('Tem certeza que deseja excluir este endereço?')"
              >
                Excluir
              </button>
            </form>
          </div>
        </div>
        {{/each}}
      </div>
      {{else}}
      <div class="empty-addresses">
        <p>📭 Nenhum endereço cadastrado ainda</p>
        <p>Use o formulário acima para adicionar o primeiro endereço.</p>
      </div>
      {{/if}}
    </div>
  </section>
</div>

<style>
.edit-container {
  display: grid;
  gap: 2rem;
}

.user-edit-section,
.addresses-section {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.user-edit-section h2,
.addresses-section h2 {
  color: #495057;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.addresses-section h3 {
  color: #6c757d;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.address-form-container {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

.addresses-list {
  display: grid;
  gap: 1rem;
}

.address-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-left: 4px solid #667eea;
}

.address-info strong {
  color: #495057;
  display: block;
  margin-bottom: 0.5rem;
}

.city {
  color: #6c757d;
  font-style: italic;
}

.address-meta {
  color: #adb5bd;
  font-size: 0.8rem;
  display: block;
  margin-top: 0.5rem;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
}

.empty-addresses {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.form-actions {
  text-align: center;
  margin-top: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Responsividade */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .address-item {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .addresses-list-container h3 {
    text-align: center;
  }
}

/* Animações */
.address-item {
  transition: transform 0.2s, box-shadow 0.2s;
}

.address-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

/* Melhorias visuais */
.address-form {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  background: white;
}

.address-form:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
</style>
```

---

## 🏃‍♂️ PARTE 7: EXECUTANDO O PROJETO

### Passo 14: Configurando Scripts no package.json

**O que vamos fazer:** Configurar comandos para facilitar o desenvolvimento.

Edite o arquivo `package.json` e adicione na seção "scripts":

```json
{
  "name": "meu-projeto-sequelize",
  "version": "1.0.0",
  "description": "Sistema de gerenciamento de usuários com Node.js e Sequelize",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["nodejs", "sequelize", "mysql", "express", "crud"],
  "author": "Seu Nome",
  "license": "MIT"
}
```

---

### Passo 15: Primeira Execução

**O que vamos fazer:** Testar se tudo está funcionando corretamente.

1. **Abra o terminal na pasta do projeto**
2. **Execute o comando para desenvolvimento:**

```bash
npm run dev
```

3. **Você deve ver mensagens similares a:**

```
Conexão com MySQL estabelecida com sucesso!
Modelos sincronizados com o banco de dados!
Servidor rodando em http://localhost:3000
Pressione Ctrl+C para parar o servidor
```

4. **Abra o navegador em:** `http://localhost:3000`
5. **Teste todas as funcionalidades:**

   - Cadastrar usuários
   - Listar usuários
   - Ver detalhes
   - Editar usuários
   - Adicionar endereços
   - Excluir endereços
   - Excluir usuários

---

## SOLUÇÃO DE PROBLEMAS COMUNS

### Erro de Conexão com MySQL

**Problema:** `ECONNREFUSED 127.0.0.1:3306`

**Soluções:**

1. Verificar se MySQL está rodando
2. Confirmar usuário e senha no arquivo `db/conn.js`
3. Certificar que o banco `nodesequelize` existe

### Erro "Cannot GET /"

**Problema:** Página não carrega

**Soluções:**

1. Verificar se todas as dependências foram instaladas
2. Confirmar estrutura de pastas
3. Verificar se o arquivo `index.js` está correto

### Erro de Template

**Problema:** `Error: Failed to lookup view`

**Soluções:**

1. Verificar se todos os arquivos `.handlebars` existem
2. Confirmar estrutura da pasta `views/`
3. Verificar sintaxe dos templates

---

## CONCEITOS IMPORTANTES APRENDIDOS

### 1. **ORM (Object-Relational Mapping)**

- Sequelize facilita operações no banco de dados
- Modelos representam tabelas
- Relacionamentos são definidos no código

### 2. **Padrão MVC Básico**

- **Models:** Arquivos na pasta `models/`
- **Views:** Templates Handlebars
- **Controllers:** Rotas no `index.js`

### 3. **Operações CRUD**

- **Create:** `Model.create()`
- **Read:** `Model.findAll()`, `Model.findByPk()`
- **Update:** `Model.update()`
- **Delete:** `Model.destroy()`

### 4. **Relacionamentos**

- **belongsTo:** Um pertence a um
- **hasMany:** Um tem muitos
- **include:** Busca dados relacionados

---

## PRÓXIMOS PASSOS

### Melhorias que você pode implementar:

1. **Autenticação de usuários**
2. **Paginação na listagem**
3. **Busca e filtros**
4. **Validações mais robustas**
5. **API REST**
6. **Testes automatizados**
7. **Deploy em produção**

---

## PARABÉNS!

Você criou uma aplicação web completa com:

- Conexão com banco de dados MySQL
- Operações CRUD completas
- Relacionamento entre tabelas
- Interface visual atrativa
- Validações e tratamento de erros
- Design responsivo

Continue estudando e praticando! 

---
