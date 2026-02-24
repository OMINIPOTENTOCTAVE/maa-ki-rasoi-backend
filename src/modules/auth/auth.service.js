const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock OTP storage for MVP 
const otpStore = new Map();

class AuthService {
    async sendSMS(phone, otp) {
        const isDummyKey = !process.env.FAST2SMS_API_KEY || process.env.FAST2SMS_API_KEY.includes('dummy');

        // Add API Key Debug
        console.log("FAST2SMS KEY LENGTH:", process.env.FAST2SMS_API_KEY?.length);

        if (process.env.NODE_ENV === 'development') {
            console.log("DEV MODE OTP:", otp);
            return { success: true, devOtp: otp };
        }

        if (!isDummyKey) {
            try {
                const apiRes = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
                    variables_values: otp,
                    route: 'otp',
                    numbers: phone
                }, {
                    headers: {
                        "authorization": process.env.FAST2SMS_API_KEY.replace(/['"]/g, '').trim(),
                        "Content-Type": "application/json"
                    }
                });
                console.log(`[REAL SMS] Sent OTP to ${phone}`);
                return { success: true };
            } catch (smsError) {
                const apiErr = smsError.response?.data;
                console.error("SMS FAILED:", apiErr || smsError.message);

                // If Fast2SMS says account needs deposit or website verification, fallback safely rather than paralyzing app
                if (apiErr && (apiErr.status_code === 999 || apiErr.status_code === 996)) {
                    console.warn(`[SMS FALLBACK] Fast2SMS Account Unverified (${apiErr.status_code}). Dummy mode activated for ${phone}. OTP: ${otp}`);
                    return { success: true, devOtp: otp };
                }

                throw new Error("OTP service temporarily unavailable");
            }
        } else {
            console.log(`[MOCK SMS] OTP for ${phone} is ${otp}`);
            return { success: true };
        }
    }

    generateOTP() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    storeOTP(phone, otp) {
        otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 min expiry
    }

    validateOTP(phone, otp) {
        const stored = otpStore.get(phone);
        if (!stored || stored.otp !== otp || stored.expiresAt < Date.now()) {
            return false;
        }
        otpStore.delete(phone);
        return true;
    }
}

module.exports = new AuthService();
