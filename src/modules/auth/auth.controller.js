const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../prisma");

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await prisma.adminUser.findUnique({ where: { username } });

        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const count = await prisma.adminUser.count();

        // Only allow one admin for MVP security
        if (count > 0) {
            return res.status(400).json({ success: false, message: "Admin already exists. Use DB to update." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await prisma.adminUser.create({
            data: { username, password: hashedPassword }
        });

        res.json({ success: true, message: "Admin created successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { login, createAdmin };
