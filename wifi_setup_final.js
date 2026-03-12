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
    console.log("\n=== MARY AG FINAL SETUP (v2 Firmware Fix) ===");
    
    const ssid = await ask("\nYour Home Wi-Fi Name: ");
    const password = await ask("Your Home Wi-Fi Password: ");

    console.log("\nPreparing RSA v2 Encryption...");
    let encryptedPwd;
    try {
        const keyRes = await axios.get(MARY_IP + '/public-key');
        const b = keyRes.data.b;
        
        // Exact slicing for v2 firmware
        const modulusHex = b.slice(56, 314);
        const exponentHex = b.slice(318, 324);
        
        const key = new NodeRSA();
        key.importKey({
            n: Buffer.from(modulusHex, 'hex'),
            e: Buffer.from(exponentHex, 'hex')
        }, 'components-public');
        
        // Force strict PKCS1 padding
        key.setOptions({ encryptionScheme: 'pkcs1' });
        
        // Encrypt and ensure it's exactly 256 characters
        encryptedPwd = key.encrypt(password, 'hex');
        console.log(`✅ Encrypted Password Length: ${encryptedPwd.length}`);
    } catch (e) {
        console.error("❌ Encryption failed: " + e.message);
        process.exit(1);
    }

    console.log("Sending Payload (Form-Encoded)...");
    
    // Using a raw string to ensure the order and format are perfect for v2
    const payload = `idx=0&ssid=${encodeURIComponent(ssid)}&sec=3&ch=0&pwd=${encryptedPwd}`;

    try {
        await axios.post(MARY_IP + '/configure-ap', payload, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log("✅ Credentials Accepted.");
        
        console.log("Issuing Final Connect...");
        await axios.post(MARY_IP + '/connect-ap', 'idx=0', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log("\n==================================");
        console.log("SUCCESS! Watch the light now.");
        console.log("It should go: Blue -> Green (Blinking) -> Cyan");
        console.log("==================================\n");
    } catch (e) {
        console.error("❌ Transmission error: " + e.message);
    }
    rl.close();
}
main();
