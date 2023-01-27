const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
    },
    message: {
        type: String,
        required: true,
    },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
