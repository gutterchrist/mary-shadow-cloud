const axios = require('axios');
const NodeRSA = require('node-rsa');

async function main() {
    const MARY_IP = 'http://192.168.0.1';
    const claimCode = "qubYV+DlXUQeOWa+HYK7UkfMJpkTpGnFA7NOH0eRp0BAbzOmdRBPsBoDQu7/7Z7";
    
    console.log("--- MARY AG GOOD BOX SETUP ---");

    const ssid = "TELUS1136";
    const password = ".Florida.710838";
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

        console.log("2. Sending Wi-Fi Credentials...");
        const payload = JSON.stringify({ idx: 0, ssid: ssid, sec: sec, ch: 0, pwd: encryptedPwd });
        await axios.post(`${MARY_IP}/configure-ap`, payload, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        console.log("3. Sending Claim Code & Product ID...");
        const claimPayload = JSON.stringify({ k: "cc", v: claimCode });
        await axios.post(`${MARY_IP}/set`, claimPayload, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        
        const productPayload = JSON.stringify({ k: "id", v: 266 });
        await axios.post(`${MARY_IP}/set`, productPayload, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        console.log("✅ Claim Code & Product ID Accepted.");

        console.log("4. Issuing Final Connect...");
        await axios.post(`${MARY_IP}/connect-ap`, JSON.stringify({ idx: 0 }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        
        console.log("5. Forcing Hardware Reboot...");
        try { await axios.post(`${MARY_IP}/reboot`); } catch(e) {}
        
        console.log("\n==================================");
        console.log("SUCCESS! The box should REBOOT now.");
        console.log("==================================");

    } catch (e) {
        console.error("❌ Error: " + (e.response ? JSON.stringify(e.response.data) : e.message));
    }
}
main();