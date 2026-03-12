const axios = require('axios');

async function main() {
    const MARY_IP = 'http://192.168.0.1';
    console.log("--- MARY AG JSON SETUP ---");

    const payload = {
        idx: 0,
        ssid: "TELUS1136",
        sec: 4194308,
        ch: 0,
        pwd: "f5hjbs599q"
    };

    try {
        console.log("Sending JSON Credentials...");
        await axios.post(`${MARY_IP}/configure-ap`, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("✅ Credentials Accepted.");

        console.log("Sending Connect Command...");
        await axios.post(`${MARY_IP}/connect-ap`, { idx: 0 }, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("✅ DONE. Watch the light now!");
    } catch (e) {
        console.error("❌ Error: " + (e.response ? JSON.stringify(e.response.data) : e.message));
    }
}
main();
