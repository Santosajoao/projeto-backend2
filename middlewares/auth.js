const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Acesso negado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido!" });
    }

    try {
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar usuário" });
    }
  });
};

const isAdm = (req, res, next) => {
  if (!req.user.isAdm) {
    return res
      .status(403)
      .json({
        message: "Acesso negado: apenas administradores podem realizar a ação",
      });
  }

  next();
};

const urlNotValid = (req, res, next) => {
  res.status(404).json({ message: "Rota não existente" });
};

module.exports = { verifyToken, isAdm, urlNotValid };
