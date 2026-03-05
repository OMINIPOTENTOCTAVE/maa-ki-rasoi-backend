const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.customer_token ||
        (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) return res.status(401).json({
        success: false, message: "Authentication required"
    });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'customer') return res.status(403).json({
            success: false, message: "Customer access only"
        });
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') return res.status(401).json({
            success: false, message: "Token expired", code: "TOKEN_EXPIRED"
        });
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.admin_token ||
        (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) return res.status(401).json({
        success: false, message: "Admin authentication required"
    });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({
            success: false, message: "Forbidden: Admin access only"
        });
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') return res.status(401).json({
            success: false, message: "Token expired", code: "TOKEN_EXPIRED"
        });
        return res.status(401).json({ success: false, message: "Invalid admin token" });
    }
};

module.exports = { authMiddleware, authenticateAdmin };
