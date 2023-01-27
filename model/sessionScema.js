const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    startTime: {
        type: Date,
        default: Date.now(),
    },
    endTime: {
        type: Date,
        default: Date.now() + 5 * 60000
    },
    active: {
        type: Boolean,
        default: true,
    }
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;