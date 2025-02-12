require('dotenv').config();
const express = require('express');
const { urlNotValid } = require('./middlewares/auth.js');
const usersRoutes = require('./routes/usersRoutes');
const ticketsRoutes = require('./routes/ticketsRoutes');
const { sequelize } = require('./helpers/db');

const app = express();

app.use(express.json());

// Rotas principais
app.use('/users', usersRoutes);
app.use('/tickets', ticketsRoutes);

// Middleware para rota não encontrada
app.use(urlNotValid);

// Função assíncrona para criar as tabelas no MySQL caso elas não existam ao compilar o projeto
(async () => {
  try {
    await sequelize.sync();
    app.listen(4000, () => console.log("Servidor rodando na porta 4000"));
  } 
  
  catch (error) {
    console.error("Erro ao sincronizar o banco de dados:", error);
  }
})();
