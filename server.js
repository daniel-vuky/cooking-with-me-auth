const express = require("express");
const dotenv = require("dotenv").config();
const connectoDb = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const port = process.env.SERVER_PORT || 8080;

connectoDb();
app.use(express.json());
app.use("/users/", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Auth server running on port ${port}`);
});