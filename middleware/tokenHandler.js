const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async(req, res, next) => {
    let token;
    let authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        const decodedToken = await jwt.verify(
            token,
            process.env.JWT_ACCESS_TOKEN_SECRET
        );
        if (!decodedToken) {
            res.status(401);
            throw new Error("User is not authorized!");
        }
        req.user = decodedToken;
        next();
    }
    if (!token) {
        res.status(401);
        throw new Error("User is not authorized!");
    }
});

module.exports = validateToken;