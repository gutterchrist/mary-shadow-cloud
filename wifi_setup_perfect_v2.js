const axios = require('axios');
const NodeRSA = require('node-rsa');

async function main() {
    const MARY_IP = 'http://192.168.0.1';
    console.log("--- MARY AG v2 PERFECT SETUP ---");

    try {
        const keyRes = await axios.get(`${MARY_IP}/public-key`);
        const b = keyRes.data.b;
        const modulusHex = b.slice(56, 314);
        const exponentHex = b.slice(318, 324);
        const key = new NodeRSA();
        key.importKey({ n: Buffer.from(modulusHex, 'hex'), e: Buffer.from(exponentHex, 'hex') }, 'components-public');
        key.setOptions({ encryptionScheme: 'pkcs1' });
        
        const encryptedPwd = key.encrypt("f5hjbs599q", 'hex');
        
        // The Payload: Everything must be a string, and 'sec' must be "3"
        const payload = JSON.stringify({
            idx: 0,
            ssid: "TELUS1136",
            sec: 4, 
            ch: 0,
            pwd: encryptedPwd
        });

        console.log("Sending Encrypted Payload...");
        const res = await axios.post(`${MARY_IP}/configure-ap`, payload, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log("Result:", res.data);

        await axios.post(`${MARY_IP}/connect-ap`, JSON.stringify({ idx: 0 }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log("✅ Connect sent.");

    } catch (e) {
        console.error("❌ Error: " + e.message);
    }
}
main();
