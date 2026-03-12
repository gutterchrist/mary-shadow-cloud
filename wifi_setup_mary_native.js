const axios = require('axios');
const NodeRSA = require('node-rsa');

async function main() {
    const MARY_IP = 'http://192.168.0.1';
    console.log("--- MARY AG NATIVE APP EMULATION ---");

    const ssid = "TELUS1136";
    const password = "f5hjbs599q";
    const sec = 4194308; // Using the value from the scan

    try {
        console.log("1. Fetching Public Key...");
        const keyRes = await axios.get(`${MARY_IP}/public-key`);
        const b = keyRes.data.b;

        const modulusHex = b.slice(56, 314);
        const exponentHex = b.slice(318, 324);

        const key = new NodeRSA();
        key.importKey({
            n: Buffer.from(modulusHex, 'hex'),
            e: Buffer.from(exponentHex, 'hex')
        }, 'components-public');
        key.setOptions({ encryptionScheme: 'pkcs1' });

        const encryptedPwd = key.encrypt(password, 'hex');
        console.log("✅ Encryption Complete.");

        // THE MARY SECRET: JSON body + Form-URLEncoded header
        const payload = JSON.stringify({
            idx: 0,
            ssid: ssid,
            sec: sec,
            ch: 0,
            pwd: encryptedPwd
        });

        console.log("2. Sending Payload (Mary Native Mode)...");
        const configRes = await axios.post(`${MARY_IP}/configure-ap`, payload, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log("Config Result:", configRes.data);

        console.log("3. Sending Connect Command...");
        const connectRes = await axios.post(`${MARY_IP}/connect-ap`, JSON.stringify({ idx: 0 }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log("Connect Result:", connectRes.data);

        console.log("\n==================================");
        console.log("If result was {r:0}, watch for GREEN lights!");
        console.log("==================================");

    } catch (e) {
        console.error("❌ Error: " + (e.response ? JSON.stringify(e.response.data) : e.message));
    }
}
main();