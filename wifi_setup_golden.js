const axios = require('axios');
const NodeRSA = require('node-rsa');

async function main() {
    const MARY_IP = 'http://192.168.0.1';
    console.log("--- MARY AG GOLDEN SETUP ---");

    const ssid = "TELUS1136";
    const password = "f5hjbs599q";
    const sec = 4194308;

    try {
        console.log("1. Fetching Public Key...");
        const keyRes = await axios.get(`${MARY_IP}/public-key`);
        const b = keyRes.data.b;
        const modulusHex = b.slice(56, 314);
        const exponentHex = b.slice(318, 324);
        const key = new NodeRSA();
        key.importKey({ n: Buffer.from(modulusHex, 'hex'), e: Buffer.from(exponentHex, 'hex') }, 'components-public');
        key.setOptions({ encryptionScheme: 'pkcs1' });
        const encryptedPwd = key.encrypt(password, 'hex');
        console.log("✅ Encryption Complete.");

        const payload = JSON.stringify({
            idx: 0,
            ssid: ssid,
            sec: sec,
            ch: 0,
            pwd: encryptedPwd
        });

        console.log("2. Sending Golden Payload...");
        const configRes = await axios.post(`${MARY_IP}/configure-ap`, payload, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log("Config Result:", configRes.data);

        console.log("3. Sending Connect Command...");
        await axios.post(`${MARY_IP}/connect-ap`, JSON.stringify({ idx: 0 }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log("✅ DONE! The box should reboot now.");

    } catch (e) {
        console.error("❌ Error: " + (e.response ? JSON.stringify(e.response.data) : e.message));
    }
}
main();