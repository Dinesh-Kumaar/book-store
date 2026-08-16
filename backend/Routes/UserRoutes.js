const express = require("express");
const router = express.Router();

const { registerUser, loginUser, updateUser, deleteUser, getUserById } = require("../Controller/UserController");

const authMiddleWare = require("../Middleware/authMiddleware");
router.post("/register", registerUser);
router.post("/signin", loginUser);
router.put("/user/update/:id", updateUser);
router.delete("/user/delete/:id", deleteUser);
router.get("/user/", authMiddleWare, getUserById)
module.exports = router;