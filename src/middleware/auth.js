const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    let token = req.cookies?.customer_token;

    // Fallback to Authorization header if not found in cookie
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: "Forbidden: Admin access only" });
    }
};

module.exports = { authMiddleware, isAdmin };
