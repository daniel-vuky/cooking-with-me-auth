const connectToDb = require("../../config/database");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

describe("Database connection", () => {
    it("should log 'Connected to mongo' when successfully connected", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        jest.spyOn(mongoose, "connect").mockResolvedValue({});
        await connectToDb();
        expect(consoleSpy).toHaveBeenCalledWith("Connected to mongo");
        consoleSpy.mockRestore();
    });
});