require('dotenv').config();
const express = require('express');
const { urlNotValid } = require('./middlewares/auth.js');
const mustacheExpress = require('mustache-express');
const cookieParser = require('cookie-parser');
const path = require('path');
const usersRoutes = require('./routes/usersRoutes');
const ticketsRoutes = require('./routes/ticketsRoutes');
const { sequelize } = require('./helpers/db');
const app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache'); 
app.set('views', path.join(__dirname, 'views')); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 


app.use('/users', usersRoutes);
app.use('/tickets', ticketsRoutes);


app.use(urlNotValid);


(async () => {
  try {
    await sequelize.sync();
    app.listen(8080, () => console.log("Servidor rodando na porta 8080 -> http://localhost:8080"));
  } 
  
  catch (error) {
    console.error("Erro ao sincronizar o banco de dados:", error);
  }
})();
