const express = require("express");
const {
  createUser,
  updateUser,
  deleteUser,
  getUserByName,
  getAllUsers,
} = require("../controllers/userController");

const router = express.Router();

router.post("/user", createUser);

router.patch("/user/:id", updateUser);

router.delete("/user/:id", deleteUser);

router.get("/user/getByName", getUserByName);

router.get("/user", getAllUsers);

module.exports = router;
