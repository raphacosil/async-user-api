const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const conn = require('./db/conn');
const User = require('./models/User');
const Address = require('./models/Address');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
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


app.get('/users/create', (req, res) => {
  res.render('adduser');
});

app.post('/users/create', async (req, res) => {
  try {
    const { name, occupation, newsletter } = req.body;
  
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

app.post('/users/update', async (req, res) => {
  try {
    const { id, name, occupation, newsletter } = req.body;
  
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

app.post('/users/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
  
    await Address.destroy({
      where: { userId: id }
    });
  
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

app.post('/address/create', async (req, res) => {
  try {
    const { userId, street, number, city } = req.body;
  
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

app.use((req, res) => {
  res.status(404).render('home', { 
    users: [],
    error: 'Página não encontrada' 
  });
});

async function startServer() {
  try {
    await conn.sync();
    console.log('Modelos sincronizados com o banco de dados!');
  
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