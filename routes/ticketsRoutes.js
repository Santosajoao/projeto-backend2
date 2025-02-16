const express = require("express");

const { verifyToken, isAdm } = require("../middlewares/auth.js");
const router = express.Router();

const ticketsController = require("../controllers/ticketsController.js");

router.get("/", verifyToken, ticketsController.getTickets);
router.get("/types/:name", verifyToken, ticketsController.getTicketByName);
router.get("/price/:price", verifyToken, ticketsController.getTicketsByPrice);
router.get("/userTickets", verifyToken, ticketsController.getUserTickets);
router.get("/history", verifyToken, isAdm, ticketsController.getHistory);

router.post(
  "/registerTicket",
  verifyToken,
  isAdm,
  ticketsController.registerTicket
);
router.post("/buyTicket", verifyToken, ticketsController.buyTicket);

router.post(
  "/updateTicket",
  verifyToken,
  isAdm,
  ticketsController.updateTicket
);

router.delete(
  "/deleteTicket/:id",
  verifyToken,
  isAdm,
  ticketsController.deleteTicket
);

router.get("/buyTicket", (req, res) => {
  res.render("buyTicket");
});

router.get("/registerTicket", (req, res) => {
  res.render("registerTicket");
});

router.get("/updateTicket/:id", (req, res) => {
  res.render("updateTicket");
});

module.exports = router;
