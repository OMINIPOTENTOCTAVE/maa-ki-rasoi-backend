const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function test() {
    console.log("Testing with key:", process.env.FAST2SMS_API_KEY.substring(0, 10) + '...');
    try {
        const payload = {
            route: 'q',
            message: `Your Maa Ki Rasoi OTP is 1234. Do not share.`,
            numbers: "7428020104"
        };
        const res = await axios.post('https://www.fast2sms.com/dev/bulkV2', payload, {
            headers: {
                "authorization": process.env.FAST2SMS_API_KEY.replace(/['"]/g, '').trim(),
                "Content-Type": "application/json"
            }
        });
        console.log("Success:", JSON.stringify(res.data, null, 2));
    } catch (error) {
        console.error("Error:", JSON.stringify(error.response?.data || error.message, null, 2));
    }
}
test();
