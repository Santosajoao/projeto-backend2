const express = require("express");

const usersControler = require("../controllers/usersController");

const {
  verifyToken,
  isAdm,
  userIsAdmOrHimself,
} = require("../middlewares/auth.js");
const router = express.Router();

router.get("/install", usersControler.installSystem);

router.get("/", usersControler.getUsers);

router.post("/registerUser", usersControler.createUser);
router.post("/registerAdm", verifyToken, isAdm, usersControler.createUserAdm);
router.post("/login", usersControler.verifyUser);

router.put("/updateUser", verifyToken, usersControler.updateUser);

router.delete("/:id", verifyToken, isAdm, usersControler.deleteUser);

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/users/login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

module.exports = router;
