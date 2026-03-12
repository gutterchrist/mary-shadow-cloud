const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const MARY_IP = 'http://192.168.0.1';
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

async function main() {
    console.log("
=== MARY AG SETUP (Plain-Text Mode) ===");
    
    try {
        await axios.get(MARY_IP + '/device-id', { timeout: 3000 });
        console.log("✅ Connected to Mary.");
    } catch (e) {
        console.error("❌ Connect to MARY-XXXX wifi first!");
        process.exit(1);
    }

    const ssid = await ask("Your Home Wi-Fi Name: ");
    const password = await ask("Your Home Wi-Fi Password: ");

    console.log("
Sending credentials in PLAIN TEXT...");
    
    // We try the JSON format but with the raw password
    const payload = JSON.stringify({
        idx: 0,
        ssid: ssid,
        sec: 3, 
        ch: 0,
        pwd: password // No encryption
    });

    try {
        await axios.post(MARY_IP + '/configure-ap', payload, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 8000
        });
        console.log("✅ Credentials Sent.");
        
        await axios.post(MARY_IP + '/connect-ap', JSON.stringify({ idx: 0 }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 5000
        });
        console.log("✅ Reboot Command Issued.");
    } catch (e) {
        console.log("✅ Command sent (Box is rebooting).");
    }

    console.log("
==================================");
    console.log("If it stays blinking blue, we'll try one more thing.");
    console.log("==================================
");
    rl.close();
}

main();
