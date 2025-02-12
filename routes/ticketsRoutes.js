const express = require('express')

//Importação dos middlewares de autenticação
//VerifyToken é usado para verificar o Token de Login
//isAdm analisa se o token do usuário logado tem permissão ou não de administrador
const {verifyToken, isAdm} = require('../middlewares/auth.js')
const router = express.Router()

//Chamada de funções dos controllers das rotas criadas
const ticketsController = require('../controllers/ticketsController.js')

router.get('', verifyToken, ticketsController.getTickets);
router.get('/types/:name', verifyToken, ticketsController.getTicketByName);
router.get('/price/:price', verifyToken, ticketsController.getTicketsByPrice);

//Rota para registro de um ticket
router.post('/registerTicket', verifyToken, isAdm, ticketsController.registerTicket)
router.post('/buyTicket', verifyToken, ticketsController.buyTicket)

//Rota para atualizar informações de um ticket
router.put('/updateTicket', verifyToken, isAdm, ticketsController.updateTicket)

//Rota para deletar um ticket
router.delete('/deleteTicket', verifyToken, isAdm, ticketsController.deleteTicket)

module.exports = router
