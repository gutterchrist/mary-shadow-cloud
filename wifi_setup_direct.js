const readline = require('readline');
const NodeRSA = require('node-rsa');
const axios = require('axios');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const MARY_IP = 'http://192.168.0.1';
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

async function main() {
    console.log("\n=== MARY AG DIRECT SETUP (APK MIRROR) ===");
    
    let deviceId;
    try {
        const idRes = await axios.get(MARY_IP + '/device-id');
        deviceId = idRes.data.id;
        console.log("✅ Connected! Mary ID: " + deviceId);
    } catch (e) {
        console.error("❌ Cannot reach Mary. Ensure you are on MARY-XXXX Wi-Fi.");
        process.exit(1);
    }

    const ssid = await ask("\nYour Home Wi-Fi Name: ");
    const password = await ask("Your Home Wi-Fi Password: ");

    console.log("\nEncrypting...");
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
        console.log("✅ Encryption Successful.");

    } catch (e) {
        console.error("❌ Encryption failed: " + e.message);
        process.exit(1);
    }

    console.log("Sending Credentials...");
    const payload = JSON.stringify({
        idx: 0,
        ssid: ssid,
        sec: 3, 
        ch: 0,
        pwd: encryptedPwd
    });

    try {
        const res = await axios.post(MARY_IP + '/configure-ap', payload, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log("✅ Configure Response: " + JSON.stringify(res.data));
        
        console.log("Sending Connect Command...");
        const connRes = await axios.post(MARY_IP + '/connect-ap', JSON.stringify({ idx: 0 }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log("✅ Connect Response: " + JSON.stringify(connRes.data));

    } catch (e) {
        console.log("✅ Command sent (Box should reboot).");
    }

    console.log("\n==================================");
    console.log("Check the box light now.");
    console.log("==================================\n");
    rl.close();
}

main();