const asyncHandler = require("express-async-handler");
const userModel = require("../model/userModel");

//@desc Create new account
//@route POST /users/register
//@access public
const register = asyncHandler(async (req, res) => {
    const createdUser = await userModel.create(req.body);
    if (!!createdUser.email) {
        res.status(201).json(createdUser);
        return;
    }
    res.status(404);
    throw new Error("Can not create the user");
});

//@desc Login
//@route GET /users/login
//@access public
const login = asyncHandler(async (req, res) => {
    const user = await userModel.generateJwtToken(req.body.email, req.body.id);
    res.status(200).json(user);
});

//@desc Get current user information
//@route GET /users/current
//@access private
const current = asyncHandler(async (req, res) => {
    const user = await userModel.findByEmail(req.user.email);
    res.status(200).json(user);
});

module.exports = {
    register,
    login,
    current
}