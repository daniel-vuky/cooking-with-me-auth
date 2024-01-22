const asyncHandler = require("express-async-handler");
const userModel = require("../model/userModel");
const userEmailService = require("../service/userEmail");

//@desc Create new account
//@route POST /users/register
//@access public
const register = asyncHandler(async (req, res) => {
    const createdUser = await userModel.create(req.body);
    if (!!createdUser.email) {
        res.status(201).json({message: "Your account has been created successfully!"});
        return;
    }
    res.status(404);
    throw new Error("Can not create the user");
});

//@desc Login
//@route GET /users/login
//@access public
const login = asyncHandler(async (req, res) => {
    const token = await userModel.generateJwtToken(req.body.email, req.body.id);
    res.status(200).json({token: token});
});

//@desc Senf email reset password
//@route GET /users/forgotpassword
//@access public
const forgotPassword = asyncHandler(async(req, res) => {
    const email = req.params.email;
    const userId = req.existedUser.id;
    const token = await userModel.generateJwtToken(email, userId);
    userEmailService.sendForgotPasswordEmail(email, token);
    res.status(201).json({message: "Forgot password has been sent sucessfully"});
});

//@desc Change password
//@route PUT /users/changepassword
//@access private
const changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const newPassword = req.body.new_password;
    await userModel.findByIdAndUpdate(userId, {password: await userModel.hashPassword(newPassword)});
    res.status(200).json({message: "Your password has been updated sucessfully"});
});

//@desc Get current user information
//@route GET /users/current
//@access private
const current = asyncHandler(async (req, res) => {
    const user = await userModel.findByEmail(req.user.email);
    res.status(200).json(user);
});

//@desc Get current user information
//@route PUT /users/updateProfile
//@access private
const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    await userModel.findByIdAndUpdate(userId, {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        short_description: req.body.short_description,
        long_description: req.body.long_description,
        signature: req.body.signature,
        social_network: req.body.social_network,
        quote: req.body.quote
    });
    res.status(200).json({message: "Your profile has been updated sucessfully"});
});

module.exports = {
    register,
    login,
    forgotPassword,
    changePassword,
    current,
    updateProfile
}