const axios = require('axios');
const readline = require('readline');
const NodeRSA = require('node-rsa');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const MARY_IP = 'http://192.168.0.1';
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

async function main() {
    console.log("\n=== MARY AG PERFECT SETUP (Mirroring Official App) ===");
    
    // 1. Verify Connection
    let deviceId;
    try {
        const idRes = await axios.get(MARY_IP + '/device-id', { timeout: 3000 });
        deviceId = idRes.data.id;
        console.log(`✅ Connected! Mary ID: ${deviceId}`);
    } catch (e) {
        console.error("❌ Not connected to MARY Wi-Fi. Please connect and try again.");
        process.exit(1);
    }

    // 2. Scan APs to find correct security type
    console.log("Scanning for Wi-Fi networks...");
    let scans = [];
    try {
        const scanRes = await axios.get(MARY_IP + '/scan-ap', { timeout: 15000 });
        scans = scanRes.data.scans || [];
    } catch (e) {
        console.log("⚠️ Scan failed, we will proceed manually.");
    }

    const ssid = await ask("\nYour Home Wi-Fi Name: ");
    
    let targetAp = scans.find(ap => ap.ssid === ssid);
    let sec = 3; // Force WPA2 (Standard)
    
    if (targetAp) {
        console.log(`✅ Found network in scan (Raw Security: ${targetAp.sec})`);
        console.log("👉 Forcing Security Mode to 3 (WPA2) for compatibility.");
        sec = 3;
    } else {
        console.log("❓ Network not found in scan. Defaulting to WPA2 (sec=3).");
    }

    const password = await ask("Your Home Wi-Fi Password: ");

    // 3. Get Public Key and Encrypt
    console.log("\nFetching Public Key and Encrypting...");
    let encryptedPwd;
    try {
        const keyRes = await axios.get(MARY_IP + '/public-key');
        const b = keyRes.data.b; // Hex string
        
        // MIRRORING APK SLICING LOGIC
        const modulusHex = b.slice(56, 314);
        const exponentHex = b.slice(318, 324);
        
        console.log(`   Modulus (slice 56, 314): ${modulusHex.substring(0, 20)}...`);
        console.log(`   Exponent (slice 318, 324): ${exponentHex}`);

        const key = new NodeRSA();
        key.importKey({
            n: Buffer.from(modulusHex, 'hex'),
            e: Buffer.from(exponentHex, 'hex')
        }, 'components-public');
        
        // Official app uses PKCS#1 v1.5
        key.setOptions({ encryptionScheme: 'pkcs1' });
        
        encryptedPwd = key.encrypt(password, 'hex');
        console.log("✅ Encryption Complete.");

    } catch (e) {
        console.error("❌ Encryption failed: " + e.message);
        process.exit(1);
    }

    // 4. Send Credentials
    const payload = JSON.stringify({
        idx: 0,
        ssid: ssid,
        sec: sec, 
        ch: 0,
        pwd: encryptedPwd
    });

    console.log("Sending Credentials...");
    try {
        await axios.post(MARY_IP + '/configure-ap', payload, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 8000
        });
        console.log("✅ Credentials Accepted.");
        
        console.log("Sending Reboot Command...");
        const rebootPayload = JSON.stringify({ idx: 0 });
        await axios.post(MARY_IP + '/connect-ap', rebootPayload, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 5000
        });
        console.log("✅ Reboot Command Issued.");

    } catch (e) {
        console.error("❌ Communication error: " + e.message);
    }

    console.log("\n==================================");
    console.log("Check the box light now.");
    console.log("It should stop blinking BLUE.");
    console.log("If it blinks GREEN, it's connecting to your Wi-Fi.");
    console.log("If it blinks CYAN, it's connecting to the cloud.");
    console.log("==================================\n");
    rl.close();
}

main();