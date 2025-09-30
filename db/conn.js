const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('nodesequelize', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log,
  define: {
    timestamps: true,
    underscored: false,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

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