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
    console.log("\n=== MARY AG SECURE SETUP (Alternative) ===");
    
    try {
        const idRes = await axios.get(MARY_IP + '/device-id', { timeout: 3000 });
        console.log(`✅ Connected! ID: ${idRes.data.id}`);
    } catch (e) {
        console.error("❌ Not connected to MARY Wi-Fi.");
        process.exit(1);
    }

    const ssid = await ask("\nYour Home Wi-Fi Name: ");
    const password = await ask("Your Home Wi-Fi Password: ");

    console.log("\nFetching Key & Encrypting...");
    let encryptedPwd;
    try {
        const keyRes = await axios.get(MARY_IP + '/public-key');
        const b = keyRes.data.b;
        
        // Use a more robust RSA import
        const modulusHex = b.slice(56, 314);
        const exponentHex = b.slice(318, 324);
        
        const key = new NodeRSA();
        key.importKey({
            n: Buffer.from(modulusHex, 'hex'),
            e: Buffer.from(exponentHex, 'hex')
        }, 'components-public');
        
        // Force PKCS1 v1.5 padding which is mandatory for Particle
        key.setOptions({ encryptionScheme: 'pkcs1' });
        
        encryptedPwd = key.encrypt(password, 'hex');
        console.log("✅ Encryption Complete.");
    } catch (e) {
        console.error("❌ Encryption failed: " + e.message);
        process.exit(1);
    }

    // Trying 'sec': 3 again but with form-data only, no JSON
    console.log("Sending Credentials...");
    const params = new URLSearchParams();
    params.append('idx', '0');
    params.append('ssid', ssid);
    params.append('sec', '3'); 
    params.append('ch', '0');
    params.append('pwd', encryptedPwd);

    try {
        await axios.post(MARY_IP + '/configure-ap', params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log("✅ Credentials Accepted.");
        
        const rebootParams = new URLSearchParams();
        rebootParams.append('idx', '0');
        await axios.post(MARY_IP + '/connect-ap', rebootParams.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log("✅ Reboot Command Sent.");
    } catch (e) {
        console.error("❌ Error: " + e.message);
    }
    rl.close();
}
main();