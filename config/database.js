const mongoose = require("mongoose");

const connectToDb = async () => {
    try {
        mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        console.log(`Connected to mongo`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

module.exports = connectToDb;