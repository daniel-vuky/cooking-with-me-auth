const {
    validateRegisterInput,
    validateSignInInput,
    validateForgotPasswordInput,
    validateUpdatePasswordInput
} = require("../../middleware/inputValidator");
const userModel = require("../../model/userModel");

describe("validateRegisterInput middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                email: "test@example.com",
                password: "password",
                firstname: "John"
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should call next() if all required fields are provided", async () => {
        jest.spyOn(userModel, "findByEmail").mockResolvedValue(null);
        jest.spyOn(userModel, "hashPassword").mockResolvedValue("hashedPassword");
        await validateRegisterInput(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it("should return 400 status and an error message if any required field is missing", async () => {
        delete req.body.email;
        await validateRegisterInput(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 401 status and an error message if the email already exists", async () => {
        jest.spyOn(userModel, "findByEmail").mockResolvedValue({ email: req.body.email });
        await validateRegisterInput(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });
});

describe("validateSignInInput middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call next() if email and password are provided and correct", async () => {
    jest.spyOn(userModel, "findByEmail").mockResolvedValue({
      email: req.body.email,
      password: "hashedPassword",
    });
    jest.spyOn(userModel, "comparePassword").mockResolvedValue(true);
    await validateSignInInput(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should return 400 status and an error message if email or password is missing", async () => {
    delete req.body.email;
    await validateSignInInput(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 401 status and an error message if email or password is incorrect", async () => {
    jest.spyOn(userModel, "findByEmail").mockResolvedValue({
      email: req.body.email,
      password: "hashedPassword",
    });
    jest.spyOn(userModel, "comparePassword").mockResolvedValue(false);
    await validateSignInInput(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("validateUpdatePasswordInput middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: {
        email: "test@example.com",
      },
      body: {
        current_password: "password",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call next() if email and current password are provided and correct", async () => {
    jest.spyOn(userModel, "findByEmail").mockResolvedValue({
      email: req.user.email,
      password: "hashedPassword",
    });
    jest.spyOn(userModel, "comparePassword").mockResolvedValue(true);
    await validateUpdatePasswordInput(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should return 400 status and an error message if email is missing", async () => {
    delete req.user.email;
    await validateUpdatePasswordInput(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 401 status and an error message if email or current password is incorrect", async () => {
    jest.spyOn(userModel, "findByEmail").mockResolvedValue({
      email: req.user.email,
      password: "hashedPassword",
    });
    jest.spyOn(userModel, "comparePassword").mockResolvedValue(false);
    await validateUpdatePasswordInput(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("validateForgotPasswordInput middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        email: "test@example.com",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call next() if email is provided and exists in the database", async () => {
    jest.spyOn(userModel, "findByEmail").mockResolvedValue({
      email: req.params.email,
    });
    await validateForgotPasswordInput(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should return 400 status and an error message if email is missing", async () => {
    delete req.params.email;
    await validateForgotPasswordInput(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 401 status and an error message if email does not exist in the database", async () => {
    jest.spyOn(userModel, "findByEmail").mockResolvedValue(null);
    await validateForgotPasswordInput(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});