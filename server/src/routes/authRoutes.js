/*define endpoints for authentication*/

const express = require("express");
const { register, login, logout, editProfile } = require("../controllers/authController")

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/edit-profile", editProfile);

module.exports = router;