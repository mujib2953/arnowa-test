const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const token = req.header("Auth-Token");
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denaied." });
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.user_id = decodedToken.userId;
        req.session_id = decodedToken.sessionId;
        next();
    } catch (e) {
        res.status(401).json({ message: "Invalid token, authorization denaied." });
    }
};

module.exports = { validateToken };