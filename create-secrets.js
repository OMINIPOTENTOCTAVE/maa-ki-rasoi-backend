const { execSync } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');

async function main() {
    const secrets = {
        'DATABASE_URL': 'postgresql://postgres.mgzzonfqtxddtufjkiqw:MaaRasoi2025Secure@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1',
        'RAZORPAY_KEY_ID': 'rzp_live_SNV09guKii08AS',
        'RAZORPAY_KEY_SECRET': 'E6W0A4OGIG5cA6rmHv7N258O',
        'RAZORPAY_WEBHOOK_SECRET': crypto.randomBytes(32).toString('hex'),
        'CRON_SECRET': crypto.randomBytes(32).toString('hex'),
        'JWT_SECRET': 'maakirasoi-production-ready-secret-key-2026'
    };

    console.log("Preparing to register secrets...");

    // Update local .env with the newly generated secrets for reference
    let envContent = fs.readFileSync('.env', 'utf8');
    if (!envContent.includes('CRON_SECRET=')) {
        envContent += `\nCRON_SECRET="${secrets['CRON_SECRET']}"`;
    }
    if (!envContent.includes('RAZORPAY_WEBHOOK_SECRET=')) {
        envContent += `\nRAZORPAY_WEBHOOK_SECRET="${secrets['RAZORPAY_WEBHOOK_SECRET']}"`;
    }
    fs.writeFileSync('.env', envContent);
    console.log("Locally saved new CRON and WEBHOOK secrets inside .env");

    for (const [key, value] of Object.entries(secrets)) {
        const tempFile = `temp_${key}`;
        try {
            fs.writeFileSync(tempFile, value);
            console.log(`Pushing ${key}...`);
            // Check if secret exists
            try {
                execSync(`gcloud secrets describe ${key} --verbosity=none`);
                // Exists, so add a new version
                execSync(`gcloud secrets versions add ${key} --data-file=${tempFile}`);
                console.log(`   -> Added new version for ${key}`);
            } catch (e) {
                // Does not exist, create it
                execSync(`gcloud secrets create ${key} --data-file=${tempFile}`);
                console.log(`   -> Created new secret ${key}`);
            }
        } catch (err) {
            console.error(`Failed to push ${key}`, err.message);
        } finally {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        }
    }

    console.log("All secrets configured successfully.");
}

main();
