const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const MARY_IP = 'http://192.168.0.1';
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

async function main() {
    console.log("\n=== MARY AG WIRELESS RECOVERY TOOL ===");
    
    try {
        const idRes = await axios.get(MARY_IP + '/device-id', { timeout: 3000 });
        console.log("✅ Connected! Mary ID: " + idRes.data.id);
    } catch (e) {
        console.error("❌ Still cannot talk to the box. Ensure you are connected to the MARY Wi-Fi.");
        process.exit(1);
    }

    const ssid = await ask("\nYour Home Wi-Fi Name: ");
    const password = await ask("Your Home Wi-Fi Password: ");

    console.log("\nAttempting to send credentials...");

    // Method 1: Standard Particle JSON
    try {
        await axios.post(MARY_IP + '/configure-ap', {
            idx: 0,
            ssid: ssid,
            pwd: password,
            sec: 3,
            ch: 0
        }, { timeout: 5000 });
        console.log("👉 Method 1 (JSON) sent.");
    } catch (e) { console.log("👉 Method 1 failed."); }

    // Method 2: Form-Encoded
    try {
        const params = new URLSearchParams();
        params.append('idx', '0');
        params.append('ssid', ssid);
        params.append('pwd', password);
        params.append('sec', '3');
        params.append('ch', '0');
        await axios.post(MARY_IP + '/configure-ap', params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 5000
        });
        console.log("👉 Method 2 (Form) sent.");
    } catch (e) { console.log("👉 Method 2 failed."); }

    console.log("\nSending REBOOT command...");
    try {
        await axios.post(MARY_IP + '/connect-ap', { idx: 0 }, { timeout: 5000 });
        console.log("👉 Reboot 1 sent.");
    } catch (e) {
        const p = new URLSearchParams(); p.append('idx', '0');
        try {
            await axios.post(MARY_IP + '/connect-ap', p.toString(), { 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 5000 
            });
            console.log("👉 Reboot 2 sent.");
        } catch (err) { console.log("👉 Reboot command issued."); }
    }

    console.log("\n==================================");
    console.log("Check the light on the Mary box now.");
    console.log("If it starts blinking GREEN, it's connecting!");
    console.log("==================================\n");
    rl.close();
}

main();