const dotenv = require('dotenv').config();
const userController = require('../../controller/userController');
const mongoose = require("mongoose");
const userModel = require('../../model/userModel');
const userEmailService = require('../../service/userEmail');

describe('User controller', () => {
    beforeAll(async () => {
        mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    });
    afterAll(async () => {
        mongoose.connection.close();
        jest.clearAllMocks();
    });
    describe('register', () => {
        it('should return 201 when create user successfully', async () => {
            const req = {
                body: {
                    email: "anhvdk@gmail.com",
                    firstname: "daniel",
                    lastname: "vu",
                    password: "123456",
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            jest.spyOn(userModel, "create").mockResolvedValue({email: "anhvdk@smartosc.com"});
            await userController.register(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
        });
        it('should return 404 when failed to create user', async () => {
            const req = {
                body: {
                    email: "anhvdk@gmail.com",
                    firstname: "daniel",
                    lastname: "vu",
                    password: "123456",
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            jest.spyOn(userModel, "create").mockRejectedValue(new Error("Can not create the user"));
            await userController.register(req, res, next);
            // Use call with error only because async handler will catch the error
            expect(next).toHaveBeenCalledWith(new Error("Can not create the user"));
        });
    });
    describe('login', () => {
        it('should return 200 when login successfully', async () => {
            const req = {
                body: {
                    email: "anhvdk@gmail.com",
                    password: "123456",
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            jest.spyOn(userModel, "generateJwtToken").mockReturnValue("123456");
            await userController.login(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
        it('should return 404 when failed to generate token', async () => {
            const req = {
                body: {
                    email: "anhvdk@gmail.com",
                    password: "123456",
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            jest.spyOn(userModel, "generateJwtToken").mockRejectedValue(new Error("Can not generate the token"));
            await userController.login(req, res, next);
            expect(next).toHaveBeenCalledWith(new Error("Can not generate the token"));
        });
    });
    describe('forgotPassword', () => {
        it('should return 201 when send forgot password email successfully', async () => {
            const req = {
                params: {
                    email: "anhvdk@gmail.com"
                },
                existedUser: {
                    id: "123456"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            jest.spyOn(userModel, "generateJwtToken").mockReturnValue("123456");
            jest.spyOn(userEmailService, "sendForgotPasswordEmail").mockResolvedValue({});
            await userController.forgotPassword(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });
    describe('changePassword', () => {
        it('should return 200 when change password successfully', async () => {
            const req = {
                body: {
                    current_password: "123456",
                    new_password: "123456"
                },
                user: {
                    id: "123456",
                    email: "anhvdk@gmail.com"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            userModel.findByIdAndUpdate = jest.fn().mockResolvedValue({});
            await userController.changePassword(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    describe('current', () => {
        it('should return 200 when get current user successfully', async () => {
            const req = {
                user: {
                    id: "123456",
                    email: "anhvdk@gmail.com"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            userModel.findByEmail = jest.fn().mockResolvedValue({});
            await userController.current(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    describe('updateProfile', () => {
        it('should return 200 when update profile successfully', async () => {
            const req = {
                user: {
                    id: "123456",
                    email: "anhvdk"
                },
                body:{
                    "firstname": "daniel",
                    "lastname": "vu",
                    "social_network": [
                        {
                            "link": "facebook",
                            "type": "fb"
                        }
                    ]
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            userModel.findByIdAndUpdate = jest.fn().mockResolvedValue({});
            await userController.updateProfile(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});