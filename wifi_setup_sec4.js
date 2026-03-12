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
    console.log("\n=== MARY AG SETUP (Force SEC=4) ===");
    
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

    const ssid = await ask("\nYour Home Wi-Fi Name: ");
    const password = await ask("Your Home Wi-Fi Password: ");

    // 2. Encrypt
    console.log("Fetching Key...");
    let encryptedPwd;
    try {
        const keyRes = await axios.get(MARY_IP + '/public-key');
        const b = keyRes.data.b;
        
        const modulusHex = b.slice(56, 314);
        const exponentHex = b.slice(318, 324);
        
        const key = new NodeRSA();
        key.importKey({
            n: Buffer.from(modulusHex, 'hex'),
            e: Buffer.from(exponentHex, 'hex')
        }, 'components-public');
        
        key.setOptions({ encryptionScheme: 'pkcs1' });
        encryptedPwd = key.encrypt(password, 'hex');

    } catch (e) {
        console.error("❌ Encryption failed: " + e.message);
        process.exit(1);
    }

    // 3. Send Credentials with SEC=4
    const payload = JSON.stringify({
        idx: 0,
        ssid: ssid,
        sec: 4,  
        ch: 0,
        pwd: encryptedPwd
    });

    console.log("Sending Credentials (SEC=4)...");
    try {
        await axios.post(MARY_IP + '/configure-ap', payload, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 8000
        });
        console.log("✅ Credentials Accepted.");
        
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
    console.log("==================================\n");
    rl.close();
}

main();