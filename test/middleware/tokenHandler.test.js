const validateToken = require("../../middleware/tokenHandler");
const jwt = require("jsonwebtoken");

describe("validateToken middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should call next() if token is valid", async () => {
        const token = "valid_token";
        req.headers.authorization = `Bearer ${token}`;
        const decodedToken = { userId: "123" };
        jest.spyOn(jwt, "verify").mockReturnValue(decodedToken);

        await validateToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            token,
            process.env.JWT_ACCESS_TOKEN_SECRET
        );
        expect(req.user).toEqual(decodedToken);
        expect(next).toHaveBeenCalled();
    });

    it("should return 401 status and error message if token is invalid", async () => {
        const token = "invalid_token";
        req.headers.authorization = `Bearer ${token}`;
        jest.spyOn(jwt, "verify").mockReturnValue(null);

        await validateToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            token,
            process.env.JWT_ACCESS_TOKEN_SECRET
        );
        expect(req.user).toBeUndefined();
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 401 status and error message if token is missing", async () => {
        await validateToken(req, res, next);

        expect(jwt.verify).not.toHaveBeenCalled();
        expect(req.user).toBeUndefined();
        expect(req.user).toBeUndefined();
        expect(res.status).toHaveBeenCalledWith(401);
    });
});