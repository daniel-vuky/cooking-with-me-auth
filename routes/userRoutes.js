const express = require("express");
const {
    validateRegisterInput,
    validateSignInInput,
    validateForgotPasswordInput,
    validateUpdatePasswordInput
} = require("../middleware/inputValidator");
const {
    register,
    login,
    forgotPassword,
    changePassword,
    current,
    updateProfile
} = require("../controller/userController");
const validateToken = require("../middleware/tokenHandler")

const router = express.Router();

router.post("/register", validateRegisterInput, register);
router.get("/login", validateSignInInput, login);

router.get("/forgotpassword/:email", validateForgotPasswordInput, forgotPassword);
router.put("/resetpassword", validateToken, changePassword);
router.put("/changepassword", validateToken, validateUpdatePasswordInput, changePassword);

router.get("/current", validateToken, current);
router.put("/updateProfile", validateToken, updateProfile);

module.exports = router;