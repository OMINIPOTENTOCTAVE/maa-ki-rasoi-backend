const axios = require('axios');

(async () => {
    try {
        console.log("Calling localhost:5000...");
        const res = await axios.post('http://localhost:5000/auth/otp/request', {
            phone: '7428020104'
        });
        console.log("Success:", res.data);
    } catch (e) {
        console.error("Error Status:", e.response?.status);
        console.error("Error Data:", e.response?.data);
    }
})();
