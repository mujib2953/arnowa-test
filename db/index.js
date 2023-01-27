const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log(`Mongo DB connected.`);
        })
        .catch((error) => {
            console.error("Unable to connect Mongo DB.", error);
        });
};

module.exports = connectDB;