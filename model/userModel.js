const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSocialSchema = mongoose.Schema({
    link: String,
    type: String
});

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide email!"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is invalid"]
    },
    firstname: {
        type: String,
        required: [true, "Please provide firstname"]
    },
    short_description: String,
    long_description: String,
    signature: String,
    quote: String,
    lastname: String,
    password: String,
    social_network: [userSocialSchema]
}, {
    timestamps: true,
    statics: {
        findByEmail: function(email) {
            return this.findOne({email: new RegExp(email, 'i')});
        },
        hashPassword: function(password) {
            return bcrypt.hash(password, 10)
        },
        comparePassword: function(password, userPassword) {
            return bcrypt.compare(password, userPassword);
        },
        generateJwtToken: function(email, userId) {
            return jwt.sign(
                {
                    email: email,
                    id: userId
                },
                process.env.JWT_ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "1h"
                }
            );
        }
    }
});

module.exports = mongoose.model("users", userSchema);