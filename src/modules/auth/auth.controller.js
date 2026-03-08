const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const prisma = require("../../prisma");
const authService = require("./auth.service");
const admin = require("firebase-admin");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
}
const firebaseLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ success: false, message: "Firebase ID token is required" });
        }

        // Verify the Firebase ID token
        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (err) {
            console.error(err);
            return res.status(401).json({ success: false, message: "Invalid Firebase token" });
        }

        const { uid, email, name, picture, phone_number } = decodedToken;

        // Find existing customer by firebaseUid, email, or phone
        let customer = await prisma.customer.findFirst({
            where: {
                OR: [
                    { firebaseUid: uid },
                    ...(email ? [{ email }] : []),
                    ...(phone_number ? [{ phone: phone_number }] : [])
                ]
            }
        });

        if (!customer) {
            // Create new customer
            customer = await prisma.customer.create({
                data: {
                    firebaseUid: uid,
                    email: email || null,
                    phone: phone_number || null,
                    name: name || email || phone_number || "Customer",
                }
            });
        } else {
            // Link account if needed
            customer = await prisma.customer.update({
                where: { id: customer.id },
                data: {
                    firebaseUid: uid,
                    email: customer.email || email,
                    name: customer.name || name,
                    phone: customer.phone || phone_number
                }
            });
        }

        // Generate JWT tokens
        const accessToken = jwt.sign(
            { id: customer.id, email: customer.email, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: customer.id, version: customer.tokenVersion || 0 },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.cookie('customer_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.json({ success: true, token: accessToken, customer });
    } catch (error) {
        console.error("[FIREBASE AUTH ERROR]", error.message);
        res.status(500).json({ success: false, message: "Firebase authentication failed" });
    }
};

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

        const token = jwt.sign({ id: admin.id, username: admin.username, role: 'admin' }, process.env.JWT_SECRET, {
            expiresIn: "8h",
        });

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const adminGoogleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ success: false, message: "Google ID token required" });

        // Log for debugging
        console.log(`[ADMIN LOGIN ATTEMPT] Received ID Token. Length: ${idToken.length}`);

        // Verify the Firebase ID token
        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (err) {
            console.error("[FIREBASE ADMIN VERIFY FAIL]", err.message);

            // DEV FALLBACK: If service account is missing and we're in dev, 
            // at least check if the token payload matches an authorized email.
            if (process.env.NODE_ENV === 'development') {
                console.warn("[DEV MODE] Verification failed, attempting payload fallback...");
                const payload = jwt.decode(idToken);
                if (payload && payload.email) {
                    console.log(`[DEV MODE] Decoded email from payload: ${payload.email}`);
                    decodedToken = payload;
                } else {
                    return res.status(401).json({ success: false, message: "Invalid Admin token and payload decode failed." });
                }
            } else {
                return res.status(401).json({ success: false, message: "Invalid Admin token or service account not configured." });
            }
        }

        const { email, name } = decodedToken;
        console.log(`[ADMIN AUTH SUCCESS] Email decoded: ${email}`);

        // Verify against environment variable ADMIN_EMAILS (comma separated)
        const allowedEmailsStr = process.env.ADMIN_EMAILS || 'vinit@maakirasoi.com,admin@maakirasoi.com';
        const allowedEmails = allowedEmailsStr.split(',').map(e => e.trim().toLowerCase());

        if (!allowedEmails.includes(email.toLowerCase())) {
            console.warn(`[UNAUTHORIZED LOGIN ATTEMPT] Email: ${email}`);
            return res.status(403).json({ success: false, message: `Access Denied: ${email} is not authorized.` });
        }

        // Find or create admin user for this email to link records like AuditLogs
        let admin = await prisma.adminUser.findFirst({
            where: { username: email }
        });

        if (!admin) {
            admin = await prisma.adminUser.create({
                data: { username: email, password: "oauth-managed-" + Date.now() }
            });
        }

        const token = jwt.sign({ id: admin.id, username: admin.username, role: 'admin' }, process.env.JWT_SECRET, {
            expiresIn: "8h",
        });

        res.json({ success: true, token, admin: { username: admin.username } });
    } catch (error) {
        console.error("[ADMIN GOOGLE AUTH ERROR]", error.response?.data || error.message);
        res.status(401).json({ success: false, message: "Admin Google authentication failed" });
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
            const result = await authService.sendSMS(phone, otp);

            // Send WhatsApp Mock OTP
            try {
                const whatsappService = require('../system/whatsapp.service');
                await whatsappService.sendOTP(phone, otp);
            } catch (waError) {
                console.warn("[WHATSAPP MOCK ERROR]", waError.message);
            }

            res.json({ success: true, message: "OTP sent successfully", ...result });
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

        // Generate Short-lived Access Token (15 minutes)
        const accessToken = jwt.sign(
            { id: customer.id, phone: customer.phone, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Generate Long-lived Refresh Token (30 days)
        const refreshToken = jwt.sign(
            { id: customer.id, version: customer.tokenVersion || 0 }, // Optional: adding versioning handles mass revocation
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        // Set HTTP Only Cookie for Refresh Token
        res.cookie('customer_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({ success: true, token: accessToken, customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.customer_refresh_token;
        if (!token) {
            return res.status(401).json({ success: false, message: "No refresh token provided" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const customer = await prisma.customer.findUnique({ where: { id: decoded.id } });

            if (!customer) {
                return res.status(401).json({ success: false, message: "Customer not found" });
            }

            // Issue new access token
            const accessToken = jwt.sign(
                { id: customer.id, phone: customer.phone, role: 'customer' },
                process.env.JWT_SECRET,
                { expiresIn: "15m" }
            );

            res.json({ success: true, token: accessToken });
        } catch (jwtError) {
            return res.status(401).json({ success: false, message: "Invalid refresh token" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, address } = req.body;
        const customerId = req.user.id;

        const updatedCustomer = await prisma.customer.update({
            where: { id: customerId },
            data: {
                ...(name && { name }),
                ...(address && { address })
            }
        });

        res.json({ success: true, customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const logout = async (req, res) => {
    res.clearCookie('customer_refresh_token');
    res.json({ success: true, message: "Logged out successfully" });
};

module.exports = { login, adminGoogleLogin, createAdmin, requestOTP, verifyOTP, refreshToken, logout, updateProfile, firebaseLogin };
