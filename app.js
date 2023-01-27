const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const connectDB = require("./db");
const User = require("./model/userSchema");
const Session = require("./model/sessionScema");
const { validateToken } = require("./middleware/AuthMiddleware");
const Message = require("./model/messageSchema");
const PORT = process.env.PORT || 5000;

dotenv.config();
const app = express();

app.use(express.json());

// -- connecting to database
connectDB();

// --- Routes/APIs
app.post("/login", async (req, res) => {
    const { name, email, mobile } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRY_TIME_IN_SEC = 5;

    // --- checking if user exist by email or mobile
    const existingUser = await User.findOne({ email, mobile });
    let user;
    let messages = [];
    let sessions = [];

    // --- if no user exist then create a new user
    if (!existingUser) {
        user = new User({ name, email, mobile });
        await user.save();
    } else {
        user = existingUser;
        messages = await Message.find({ userId: existingUser.id });
        sessions = await Session.find({ userId: existingUser.id });
    }

    // --- for all user keeping track of sessions
    const newSession = new Session({ userId: user.id });
    await newSession.save();

    // * Addding new session (current session)
    sessions.push(newSession);

    const sessionWithMessages = sessions.map((s) => {

        const _messages = [];

        for (let m of messages) {
            if (s._id.equals(m.sessionId))
                _messages.push(m._doc)
        }

        return {
            ...s._doc,
            messages: _messages,
        };
    });

    const jwtData = {
        userId: user.id,
        sessionId: newSession.id,
    };
    const token = jwt.sign(jwtData, JWT_SECRET, { expiresIn: 1000 * JWT_EXPIRY_TIME_IN_SEC });

    res.json({ message: "User created.", user, token, sessions: sessionWithMessages });
});

app.post("/logout", validateToken, async (req, res) => {

    const { session_id } = req;

    const session = await Session.findById(session_id);

    session.active = false;
    session.endTime = Date.now();

    await session.save();

    res.json({ message: "Logout successfully." });
});

app.post("/savemessage", validateToken, async (req, res) => {
    const { user_id, session_id } = req;
    const { message } = req.body;

    const newMessage = new Message({ userId: user_id, sessionId: session_id, message });
    await newMessage.save();

    res.json({ message: "Message saved successfuly.", data: newMessage });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port.`);
});