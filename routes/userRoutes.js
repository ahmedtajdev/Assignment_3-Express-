const express = require("express");
const { createUser, updateUser } = require("../controllers/userController");

const router = express.Router();

router.post("/user", createUser);

router.patch("/user/:id", updateUser);

module.exports = router;
