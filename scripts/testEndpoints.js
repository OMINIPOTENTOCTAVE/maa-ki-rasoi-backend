const axios = require('axios');
const jwt = require('jsonwebtoken');

const API_URL = 'http://localhost:5000';

async function test() {
    console.log('🚀 Starting Backend API Tests...\n');

    let adminHeader, customerHeader, subId;

    // --- STEP 1: AUTH ---
    const uniquePhone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    try {
        console.log(`1. Admin & Customer Login (Fallbacks) - Phone: ${uniquePhone}`);

        const adminPayload = { email: 'vinit@maakirasoi.com', name: 'Vinit Admin', role: 'admin' };
        const adminMockToken = jwt.sign(adminPayload, 'mock-firebase-secret');
        const adminLoginRes = await axios.post(`${API_URL}/auth/admin/google`, { idToken: adminMockToken });
        const adminToken = adminLoginRes.data.token;
        const adminCookies = adminLoginRes.headers['set-cookie'];
        adminHeader = {
            headers: {
                Authorization: `Bearer ${adminToken}`,
                Cookie: adminCookies ? adminCookies.join('; ') : ''
            }
        };

        const customerPayload = { phone_number: uniquePhone, name: 'Test Customer', role: 'customer' };
        const customerMockToken = jwt.sign(customerPayload, 'mock-firebase-secret');
        const customerLoginRes = await axios.post(`${API_URL}/auth/firebase`, { idToken: customerMockToken });
        const customerToken = customerLoginRes.data.token;
        customerHeader = { headers: { Authorization: `Bearer ${customerToken}` } };

        console.log('   ✅ Auth OK');
    } catch (e) {
        console.error('   ❌ Auth Failed:', e.response?.data || e.message);
        return;
    }

    // --- STEP 2: CONTENT ---
    try {
        console.log('\n2. Testing Content Endpoints');
        const [plans, todayMenu, weeklyMenu] = await Promise.all([
            axios.get(`${API_URL}/content/plans`),
            axios.get(`${API_URL}/content/menu/today`),
            axios.get(`${API_URL}/menu/weekly`)
        ]);
        console.log(`   ✅ Plans: ${plans.data.data.length}, Weekly: ${weeklyMenu.data.data.length}`);
    } catch (e) {
        console.error('   ❌ Content Failed:', e.response?.data || e.message);
    }

    // --- STEP 3: SUBSCRIPTIONS ---
    try {
        console.log('\n3. Testing Subscription Creation');
        const subData = {
            customerPhone: uniquePhone,
            customerName: 'Test QA',
            address: 'QA Lab 1',
            planType: 'Weekly',
            mealSlot: 'LUNCH',
            startDate: new Date().toISOString(),
            paymentMethod: 'COD'
        };
        const subRes = await axios.post(`${API_URL}/subscriptions`, subData, customerHeader);
        subId = subRes.data.subscription.id;
        console.log(`   ✅ Created ID: ${subId}`);

        console.log('3.1 Activating Subscription (Admin)');
        await axios.patch(`${API_URL}/subscriptions/${subId}/status`, { status: 'Active' }, adminHeader);
        console.log('   ✅ Activated');

        console.log('4. Testing Pause');
        const pauseRes = await axios.patch(`${API_URL}/subscriptions/${subId}/pause`, {}, customerHeader);
        console.log(`   ✅ Pause Success: ${pauseRes.data.success}`);
    } catch (e) {
        console.error('   ❌ Subscription/Pause Failed:', e.response?.data || e.message);
    }

    // --- STEP 4: CRON ---
    try {
        console.log('\n5. Testing Nightly Cron Trigger');
        const cronRes = await axios.post(`${API_URL}/orders/cron/generate-orders`, {}, {
            headers: { 'x-cron-secret': '081c97a1c7ecc8c748fb07cf9964442b329f20f65c4a9f6574cbb545ce63ffde' }
        });
        console.log(`   ✅ Cron Success: ${cronRes.data.success || cronRes.data.message}`);

        console.log('   Waiting 3s for generation...');
        await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (e) {
        console.error('   ❌ Cron Failed:', e.response?.data || e.message);
    }

    // --- STEP 5: DASHBOARD ---
    try {
        console.log('\n6. Testing Admin Dashboard Analytics (Tomorrow)');
        // Calculate tomorrow IST
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];

        const [prod, manifest] = await Promise.all([
            axios.get(`${API_URL}/subscriptions/production/today?date=${dateStr}`, adminHeader),
            axios.get(`${API_URL}/subscriptions/manifest?date=${dateStr}`, adminHeader)
        ]);
        console.log(`   ✅ Kitchen Plan: ${prod.data.metrics.totalTiffinsToPrepare}, Manifest: ${manifest.data.data.length}`);
    } catch (e) {
        console.error('   ❌ Dashboard Failed:', e.response?.data || e.message);
    }

    console.log('\n🎉 Test Suite Completed.');
}

test();
