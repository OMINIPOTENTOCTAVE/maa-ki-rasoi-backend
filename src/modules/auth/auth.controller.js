const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../prisma");
const authService = require("./auth.service");

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

// --- Customer Authentication ---

const requestOTP = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone || phone.length < 10) {
            return res.status(400).json({ success: false, message: "Valid phone number required" });
        }

        const otp = authService.generateOTP();
        authService.storeOTP(phone, otp);

        try {
            await authService.sendSMS(phone, otp);
            res.json({ success: true, message: "OTP sent successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { phone, otp, name } = req.body;

        const isValid = authService.validateOTP(phone, otp);
        if (!isValid) {
            return res.status(401).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Find or create customer
        let customer = await prisma.customer.findUnique({ where: { phone } });

        if (!customer) {
            customer = await prisma.customer.create({
                data: {
                    phone,
                    name: name || "Customer"
                }
            });
        } else if (name && customer.name !== name) {
            // Update name if provided and different
            customer = await prisma.customer.update({
                where: { id: customer.id },
                data: { name }
            });
        }

        // Generate Customer JWT
        const token = jwt.sign(
            { id: customer.id, phone: customer.phone, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        // Set HTTP Only Cookie
        res.cookie('customer_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({ success: true, customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const logout = async (req, res) => {
    res.clearCookie('customer_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = { login, createAdmin, requestOTP, verifyOTP, logout };
