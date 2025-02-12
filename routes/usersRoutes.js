const express = require('express')

//Chamada de funções do usersController
const usersControler = require('../controllers/usersController')

//Importação dos middlewares de autenticação
//VerifyToken é usado para verificar o Token de Login
//isAdm analisa se o token do usuário logado tem permissão ou não de administrador
//userisAdmOrHimself permite ações apenas para o próprio usuário ou administradores.
const {verifyToken, isAdm, userIsAdmOrHimself} = require('../middlewares/auth.js')
const router = express.Router()

//Rota get do requisito para gerar um usuário administrador para utilizar no sistema
router.get('/install', usersControler.installSystem)

//Rotas get, um para retornar todos os usuários do sistema e outro para retornar um especifico pelo id no req.params
router.get('/', usersControler.getUsers)



//Rotas post, um para registrar usuário, outro para registrar administrador (apenas administradores podem realizar) 
//e outro de login que retorna o token
router.post('/registerUser', usersControler.createUser)
router.post('/registerAdm', verifyToken, isAdm, usersControler.createUserAdm)
router.post('/login', usersControler.verifyUser)

//Rotas put para modificar as informações do usuário, sendo que um para modificar o próprio usuário
//outro apenas os administradores podem modificar.
router.put('/updateUser', verifyToken, usersControler.updateUser)

//Rota delete que permite a deletar usuário pelo req.params caso o usuário autenticado seja administrador. 
router.delete('/:id', verifyToken, isAdm, usersControler.deleteUser)

module.exports = router