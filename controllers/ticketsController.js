const Ticket = require("../models/Ticket");
const TicketStock = require("../models/TicketStock");
const UserTicket = require("../models/UserTickets");

const getTickets = async (req, res) => {
  const { page = 1 } = req.query;
  const limit = parseInt(req.query.limit, 10) || 5;

  try {
    const { count, rows } = await Ticket.findAndCountAll({
      limit: limit,
      offset: (page - 1) * limit,
    });

    const lastPage = Math.ceil(count / limit);

    res.render("tickets", {
      tickets: rows,
      currentPage: page,
      lastPage: lastPage,
      totalItems: count,
      isAdm: req.user.isAdm,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao recuperar os tickets" });
  }
};

const getTicketByName = async (req, res) => {
  const ticketName = req.params.name;

  try {
    const ticket = await Ticket.findOne({
      where: { name: ticketName },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket não encontrado" });
    }

    res.render("tickets", { tickets: ticket });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar o ticket" });
  }
};

const getTicketsByPrice = async (req, res) => {
  const { page = 1 } = req.query;
  const limit = parseInt(req.query.limit, 10) || 5;
  const ticketPrice = parseFloat(req.params.price);

  if (isNaN(ticketPrice)) {
    return res.status(400).json({ message: "Preço inválido" });
  }

  try {
    const { count, rows } = await Ticket.findAndCountAll({
      where: { price: ticketPrice },
      limit: limit,
      offset: (page - 1) * limit,
    });

    const lastPage = Math.ceil(count / limit);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({
          message: "Nenhum ticket encontrado para o preço especificado",
        });
    }

    res.status(200).json({
      tickets: rows,
      currentPage: page,
      lastPage: lastPage,
      totalItems: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tickets" });
  }
};

const registerTicket = async (req, res) => {
  const { name, price, quantity } = req.body;

  if (!name || !price || !quantity) {
    return res
      .status(400)
      .json({
        message:
          "Todos os campos são obrigatórios ou os tipos de parâmetros estão incorretos",
      });
  }

  try {
    const newTicket = await Ticket.create({
      name,
      price,
    });

    await TicketStock.create({
      quantity,
      ticketId: newTicket.id,
    });

    res.redirect("/tickets");
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar o ticket" });
  }
};

const buyTicket = async (req, res) => {
  const { ticketId, quantity } = req.body;
  const userId = req.user.id;

  if (!ticketId || !quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ message: "ID do ticket e quantidade válida são obrigatórios" });
  }

  try {
    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket não encontrado" });
    }

    const ticketStock = await TicketStock.findOne({
      where: { ticketId: ticket.id },
    });

    if (!ticketStock || ticketStock.quantity < quantity) {
      return res.status(400).json({ message: "Estoque insuficiente" });
    }

    const userTickets = [];
    for (let i = 0; i < quantity; i++) {
      userTickets.push({
        userId,
        ticketId,
      });
    }

    await UserTicket.bulkCreate(userTickets);

    ticketStock.quantity -= quantity;
    await ticketStock.save();

    res.status(200).json({
      message: "Compra realizada com sucesso",
      ticketsPurchased: quantity,
    });
  } catch (error) {
    console.error("Erro ao comprar tickets:", error);
    res.status(500).json({ message: "Erro ao comprar tickets" });
  }
};

const updateTicket = async (req, res) => {
  const ticketId = parseInt(req.body.id);

  try {
    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket não encontrado" });
    }

    const { name, price } = req.body;

    if (name) ticket.name = name;
    if (price) ticket.price = price;

    await ticket.save();

    res.redirect("/tickets");
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar o ticket" });
  }
};

const deleteTicket = async (req, res) => {
  const ticketId = parseInt(req.params.id);

  try {
    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket não encontrado." });
    }

    await ticket.destroy();

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar o ticket" });
  }
};

const getUserTickets = async (req, res) => {
  const userId = req.user.id;

  try {
    const userTickets = await UserTicket.findAll({
      where: { userId },
      include: {
        model: Ticket,
        attributes: ["name", "price"],
      },
    });

    const data = {
      userTickets: userTickets.map((userTicket) => ({
        id: userTicket.id,
        name: userTicket.Ticket.name,
        price: userTicket.Ticket.price,
      })),
    };

    res.render("userTickets", data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar os tickets do usuário" });
  }
};

const getHistory = async (req, res) => {
  try {
    const userTickets = await UserTicket.findAll({
      include: {
        model: Ticket,
        attributes: ["name", "price"],
      },
    });

    const data = {
      userTickets: userTickets.map((userTicket) => ({
        id: userTicket.id,
        name: userTicket.Ticket.name,
        price: userTicket.Ticket.price,
      })),
    };

    res.render("history", data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar os tickets do usuário" });
  }
};

module.exports = {
  getTickets,
  getTicketByName,
  getTicketsByPrice,
  buyTicket,
  registerTicket,
  updateTicket,
  deleteTicket,
  getUserTickets,
  getHistory,
};
