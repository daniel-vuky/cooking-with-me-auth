const express = require("express");
const {
    validateRegisterInput,
    validateSignInInput,
    validateUpdatePasswordInput
} = require("../middleware/inputValidator");
const {
    register,
    login,
    changePassword,
    current
} = require("../controller/userController");
const validateToken = require("../middleware/tokenHandler")

const router = express.Router();

router.post("/register", validateRegisterInput, register);
router.get("/login", validateSignInInput, login);
router.get("/changepassword", validateToken, validateUpdatePasswordInput, changePassword);
router.get("/current", validateToken, current);

module.exports = router;