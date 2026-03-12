const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const MARY_IP = 'http://192.168.0.1';

console.log("\n=== MARY AG WI-FI SETUP TOOL ===");
console.log("1. Ensure your computer is connected to the 'MARY-XXXX' Wi-Fi network.");
console.log("2. Ensure you have no ethernet cable connected (to force traffic to Wi-Fi).");
console.log("================================\n");

const ask = (q) => new Promise(resolve => rl.question(q, resolve));

async function main() {
    // 1. Check Connection
    try {
        console.log("Attempting to talk to Mary Box at 192.168.0.1...");
        const idRes = await axios.get(`${MARY_IP}/device-id`, { timeout: 5000 });
        console.log(`✅ Connected! Device ID: ${idRes.data.id}`);
        console.log("   (Save this ID! You will need it for the dashboard)");
    } catch (e) {
        console.error("❌ Could not connect to Mary Box.");
        console.error("   - Make sure you are connected to the MARY-XXXX wifi.");
        console.error("   - Turn off mobile data or ethernet if possible.");
        console.error(`   - Error: ${e.message}`);
        process.exit(1);
    }

    // 2. Get Wi-Fi Details
    const ssid = await ask("\nEnter your Home Wi-Fi Name (SSID): ");
    const password = await ask("Enter your Home Wi-Fi Password: ");
    
    // 3. Configure
    console.log(`\nSending credentials for '${ssid}'...`);
    
    // Particle SoftAP Protocol
    // sec: 3 = WPA2_AES (Standard for most homes)
    const payload = {
        idx: 0,
        ssid: ssid,
        pwd: password,
        sec: 3, 
        ch: 0
    };

    try {
        // We use application/x-www-form-urlencoded as seen in APK code for setup
        const params = new URLSearchParams();
        for (const key in payload) params.append(key, payload[key]);

        await axios.post(`${MARY_IP}/configure-ap`, params.toString(), { 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 8000 
        });
        console.log("✅ Credentials Sent.");
    } catch (e) {
        console.log("⚠️  Note: The box might not reply while it saves settings. Continuing...");
    }

    // 4. Connect
    console.log("Telling Mary to connect...");
    try {
        const connectParams = new URLSearchParams();
        connectParams.append('idx', '0');
        
        await axios.post(`${MARY_IP}/connect-ap`, connectParams.toString(), { 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 5000 
        });
        console.log("\n✅ SUCCESS! The box should now reboot.");
        console.log("Watch the light on the box:");
        console.log(" - Blinking Green: Connecting to Wi-Fi");
        console.log(" - Blinking Cyan: Connecting to Cloud");
        console.log(" - Breathing Cyan (Teal): ONLINE! 🎉");
    } catch (e) {
        console.log("✅ Command sent (Box is rebooting).");
    }

    rl.close();
}

main();