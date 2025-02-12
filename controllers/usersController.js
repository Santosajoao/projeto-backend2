const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Ticket = require('../models/Ticket')
const TicketStock = require('../models/TicketStock')

//Função que retorna todos os usuários salvos no vetor users do database
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();  // Busca todos os usuários no banco
        res.status(200).json(users);
    } 
    
    catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuários", error });
    }
};



const installSystem = async (req, res) => {
    try {
        // Verificar se o administrador já existe
        const existingAdmin = await User.findOne({
            where: { isAdm: true, email: "adm@gmail.com" }
        });

        if (existingAdmin) {
            return res.status(400).json({ message: 'Já existe o usuário Administrator no sistema.' });
        }

        const initialAdm = await User.create({
            name: "Administrator",
            email: "adm@gmail.com",
            username: "admin",
            password: "admin",
            isAdm: true
        });

        const tickets = [
            { id: 1, name: 'Meia', price: 30.00 },
            { id: 2, name: 'Inteira', price: 60.00 },
            { id: 3, name: 'V.I.P', price: 90.00 }
        ];

        const createdTickets = await Ticket.bulkCreate(tickets, { ignoreDuplicates: true });

        const ticketStockData = [
            { ticketId: 1, quantity: 20 },
            { ticketId: 2, quantity: 20 },
            { ticketId: 3, quantity: 10 }
        ];

        await TicketStock.bulkCreate(ticketStockData);

        res.status(200).json({
            message: "Sistema instalado com sucesso.",
            administrator: initialAdm,
            tickets: createdTickets,
            ticketStock: ticketStockData
        });
    } 
    
    catch (error) {
        res.status(500).json({ message: "Erro ao realizar a instalação do sistema", error });
    }
};





//Função para criar usuário
const createUser = async (req, res) => {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        const userCreated = await User.create({
            name,
            email,
            username,
            password,
            isAdm: false
        });

        res.status(201).json(userCreated);
    } 
    
    catch (error) {
        res.status(500).json({ message: "Erro ao criar usuário", error });
    }
};



//Função para criar administrador
const createUserAdm = async (req, res) => {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        const userCreated = await User.create({
            name,
            email,
            username,
            password,
            isAdm: true
        });

        res.status(201).json(userCreated);
    } 
    
    catch (error) {
        res.status(500).json({ message: "Erro ao criar administrador", error });
    }
};


//Função de login que retorna um token
const verifyUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userLogin = await User.findOne({
            where: { username, password }
        });

        if (!userLogin) {
            return res.status(401).json({ message: 'Usuário ou senha inválida, tente novamente' });
        }

        const token = jwt.sign({ id: userLogin.id, isAdm: userLogin.isAdm }, process.env.JWT_SECRET, { expiresIn: '1 hr' });
        res.cookie("token", token, { httpOnly: true });

        res.status(200).json({ message: 'Login bem-sucedido', token });
    } 
    
    catch (error) {
        res.status(500).json({ message: "Erro ao fazer login", error });
    }
};



//Função de atualizar informações do usuário
const updateUser = async (req, res) => {
    const { id, name, email, username, password } = req.body;

    try {
        const userToBeUpdated = await User.findOne({ where: { id } });

        if (!userToBeUpdated) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        await userToBeUpdated.update({ name, email, username, password });

        res.status(200).json(userToBeUpdated);
    } 
    
    catch (error) {
        res.status(500).json({ message: "Erro ao atualizar usuário", error });
    }
};



const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        const userToDelete = await User.findOne({ where: { id: userId } });

        if (!userToDelete) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (userToDelete.isAdm) {
            return res.status(400).json({ message: 'Admins não podem ser deletados' });
        }

        await userToDelete.destroy();

        res.status(200).json({ message: 'Usuário deletado', user: userToDelete });
    } 
    
    catch (error) {
        res.status(500).json({ message: "Erro ao deletar usuário", error });
    }
};


module.exports = {
    getUsers,
    installSystem,
    createUser,
    createUserAdm,
    verifyUser,
    updateUser,
    deleteUser
}
