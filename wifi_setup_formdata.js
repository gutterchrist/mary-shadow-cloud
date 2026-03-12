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
    console.log("\n=== MARY AG DIAGNOSTIC & SETUP ===");
    
    try {
        const idRes = await axios.get(MARY_IP + '/device-id', { timeout: 3000 });
        console.log(`✅ Connected! Mary ID: ${idRes.data.id}`);
    } catch (e) {
        console.error("❌ Not connected to MARY Wi-Fi. Please connect and try again.");
        process.exit(1);
    }

    // NEW: Get more data from the box
    console.log("\nScanning for networks from the box's perspective...");
    try {
        const scanRes = await axios.get(MARY_IP + '/scan-ap', { timeout: 15000 });
        console.log("Found Networks:");
        scanRes.data.scans.forEach(s => {
            console.log(` - ${s.ssid} (Signal: ${s.sig}, Sec: ${s.sec}, Ch: ${s.ch})`);
        });
    } catch (e) {
        console.log("⚠️ Scan failed, continuing manually.");
    }

    const ssid = await ask("\nYour Home Wi-Fi Name: ");
    const password = await ask("Your Home Wi-Fi Password: ");

    console.log("\nEncrypting Credentials...");
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
        
        let hex = key.encrypt(password, 'hex');
        if (hex.length % 2 !== 0) hex = '0' + hex;
        encryptedPwd = hex;
        console.log("✅ Encryption Successful.");

    } catch (e) {
        console.error("❌ Encryption failed: " + e.message);
        process.exit(1);
    }

    console.log("Sending Credentials...");
    const params = new URLSearchParams();
    params.append('idx', '0');
    params.append('ssid', ssid);
    params.append('sec', '3'); 
    params.append('ch', '0');
    params.append('pwd', encryptedPwd);

    try {
        await axios.post(MARY_IP + '/configure-ap', params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 8000
        });
        console.log("✅ Credentials Accepted.");
        
        console.log("Issuing Reboot...");
        const rebootParams = new URLSearchParams();
        rebootParams.append('idx', '0');
        await axios.post(MARY_IP + '/connect-ap', rebootParams.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 5000
        });
        console.log("✅ Reboot Successful.");

    } catch (e) {
        console.error("❌ Error: " + e.message);
    }

    console.log("\n==================================");
    console.log("Watch the light: Blinking Green means it's working!");
    console.log("==================================\n");
    rl.close();
}

main();