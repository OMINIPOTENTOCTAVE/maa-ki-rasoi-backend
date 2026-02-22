const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../prisma");

// Mock OTP storage for MVP (In production, use Redis)
const otpStore = new Map();

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

        // Generate a 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // 1. Store OTP temporarily
        // NOTE: For MVP we use an in-memory Map. For strict production, replace otpStore with Redis.
        otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 min expiry

        // 2. SEND REAL SMS VIA FAST2SMS
        const isDummyKey = !process.env.FAST2SMS_API_KEY || process.env.FAST2SMS_API_KEY.includes('dummy');

        if (!isDummyKey) {
            try {
                const axios = require('axios');
                await axios.post('https://www.fast2sms.com/dev/bulkV2', null, {
                    params: {
                        authorization: process.env.FAST2SMS_API_KEY.replace(/['"]/g, '').trim(),
                        message: `Your Maa Ki Rasoi OTP is ${otp}. Do not share.`,
                        route: 'q',
                        numbers: phone
                    }
                });
                console.log(`[REAL SMS] Sent OTP to ${phone}`);
            } catch (smsError) {
                console.error("Fast2SMS API Error: ", smsError.response?.data || smsError.message);
                return res.status(500).json({ success: false, message: "SMS Gateway Failed. Could not deliver OTP." });
            }
        } else {
            // Keep mock console log behavior for local development
            console.log(`[MOCK SMS] OTP for ${phone} is ${otp}`);
        }

        res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { phone, otp, name } = req.body;

        const stored = otpStore.get(phone);
        if (!stored || stored.otp !== otp || stored.expiresAt < Date.now()) {
            // Allow a master bypass for MVP testing
            if (otp !== '0000') {
                return res.status(401).json({ success: false, message: "Invalid or expired OTP" });
            }
        }

        // OTP is valid. Clean up.
        otpStore.delete(phone);

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

        res.json({ success: true, token, customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { login, createAdmin, requestOTP, verifyOTP };
