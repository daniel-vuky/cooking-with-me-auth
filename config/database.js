const mongoose = require("mongoose");

const connectToDb = async () => {
    try {
        const connection = mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        console.log(`Connect to mongo`);
        console.log(`Host: ${(await connection).connection.host}`);
        console.log(`DB Name: ${(await connection).connection.name}`);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

module.exports = connectToDb;