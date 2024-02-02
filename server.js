const express = require("express");
const dotenv = require("dotenv").config();
const connectoDb = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const morgan = require("morgan");
const fs = require('fs');
const path = require("path");

const app = express();
const port = process.env.SERVER_PORT || 8080;
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log/auth.log'), { flags: 'a' });

connectoDb();

app.use(express.json());
app.use(morgan("tiny", { stream: accessLogStream }));
app.use("/users/", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Auth server running on port ${port}`);
});