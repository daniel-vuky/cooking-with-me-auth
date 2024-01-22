const asyncHandler = require("express-async-handler");
const userModel = require("../model/userModel");

const validateRegisterInput = asyncHandler(async (req, res, next) => {
    const {email, password, firstname} = req.body;
    if (!email || !password || !firstname) {
        res.status(400);
        throw new Error("Missing required fields, please fulfill it and try again!");
    }
    const existedUser = await userModel.findByEmail(email);
    if (!!existedUser) {
        res.status(401);
        throw new Error("This email has already existed!");
    }
    req.body.password = await userModel.hashPassword(password);
    next();
});

const validateSignInInput = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Missing required fields, please fulfill it and try again!");
    }
    const existedUser = await userModel.findByEmail(email);
    if (!existedUser || !(await userModel.comparePassword(password, existedUser.password))) {
        res.status(401);
        throw new Error("Email or Password is not correct!");
    }
    req.body = existedUser;
    next();
});

const validateForgotPasswordInput = asyncHandler(async (req, res, next) => {
    const email = req.params.email;
    if (!email) {
        res.status(400);
        throw new Error("Missing email field, please fulfill it and try again!");
    }
    const existedUser = await userModel.findByEmail(email);
    if (!existedUser) {
        res.status(401);
        throw new Error("Can't find any account match with this email!");
    }
    req.existedUser = existedUser;
    next();
});

const validateUpdatePasswordInput = asyncHandler(async (req, res, next) => {
    const email = req.user.email;
    if (!email) {
        res.status(400);
        throw new Error("Missing email field, please fulfill it and try again!");
    }
    const existedUser = await userModel.findByEmail(email);
    const passwordMatched = await userModel.comparePassword(req.body.current_password, existedUser.password);
    if (!existedUser || !passwordMatched) {
        res.status(401);
        throw new Error("Current password is not correct!");
    }
    next();
});

module.exports = {
    validateRegisterInput,
    validateSignInInput,
    validateForgotPasswordInput,
    validateUpdatePasswordInput
}