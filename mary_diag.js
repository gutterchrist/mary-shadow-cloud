const axios = require('axios');

const MARY_IP = 'http://192.168.0.1';

async function diag() {
    console.log("--- Mary AG Diagnostic ---");
    try {
        const idRes = await axios.get(`${MARY_IP}/device-id`, { timeout: 3000 });
        console.log("Device ID:", idRes.data.id);
    } catch (e) {
        console.log("Could not get device-id:", e.message);
    }

    try {
        const keyRes = await axios.get(`${MARY_IP}/public-key`, { timeout: 3000 });
        console.log("Public Key (b):", keyRes.data.b);
    } catch (e) {
        console.log("Could not get public-key:", e.message);
    }

    try {
        const scanRes = await axios.get(`${MARY_IP}/scan-ap`, { timeout: 10000 });
        console.log("Scan Results:", JSON.stringify(scanRes.data.scans, null, 2));
    } catch (e) {
        console.log("Could not scan APs:", e.message);
    }
}

diag();
