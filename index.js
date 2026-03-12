const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3007;
const DATA_FILE = path.join(__dirname, 'data.json');

let data = { devices: [] };
if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/dashboard/:deviceId/status', async (req, res) => {
    const device = data.devices.find(d => d.id === req.params.deviceId.toUpperCase());
    if (!device) return res.status(404).send();
    try {
        const r = await axios.get(`https://api.particle.io/v1/devices/${device.id}/sensor_info_str`, {
            headers: { 'Authorization': `Bearer ${device.access_token}` },
            timeout: 10000
        });
        const raw = JSON.parse(r.data.result);
        const mapped = {
            ...raw,
            cTemp: parseFloat(raw.aTemp || raw.mTemp || 0),
            cRH: parseFloat(raw.aRH || 0),
            wLvl: (raw.wLvl === -1) ? "LOW / EMPTY" : parseFloat(raw.wLvl || 0),
            volt24: parseFloat(raw.volt24 || 0),
            ledBrightness: (parseFloat(raw.inFanS) || 0) / 100,
            mode: raw.mode || "Unknown"
        };
        res.json(mapped);
    } catch (e) { res.status(502).json({ error: 'Offline' }); }
});

app.post('/api/dashboard/:deviceId/command', async (req, res) => {
    const device = data.devices.find(d => d.id === req.params.deviceId.toUpperCase());
    if (!device) return res.status(404).send();
    const { functionName, args } = req.body;

    console.log(`[Executing] ${functionName} with args: ${args}`);

    try {
        const r = await axios.post(`https://api.particle.io/v1/devices/${device.id}/${functionName}`, 
            `arg=${args}`, 
            { 
                headers: { 'Authorization': `Bearer ${device.access_token}`, 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 15000 
            }
        );
        console.log(`[Particle Response] -> ${JSON.stringify(r.data)}`);
        res.json(r.data);
        
    } catch (e) {
        const errData = e.response ? JSON.stringify(e.response.data) : e.message;
        console.error(`[Particle Error] -> ${errData}`);
        res.status(502).json({ error: errData });
    }
});
app.get('/config', (req, res) => {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    let localIp = 'localhost';
    for (let k in interfaces) {
        for (let k2 in interfaces[k]) {
            let address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                localIp = address.address;
                break;
            }
        }
    }
    res.json({ ...data, localIp, port: PORT });
});

app.post('/api/sync', async (req, res) => {
    await syncDeviceSchedule();
    res.json({ success: true });
});

app.post('/api/schedule', async (req, res) => {
    const { startTime, endTime, phase } = req.body;
    if (startTime) data.automation.startTime = startTime;
    if (endTime) data.automation.endTime = endTime;
    if (phase) data.automation.manualPhase = phase;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    await syncDeviceSchedule(); // Trigger immediate sync
    res.json({ success: true, data: data.automation });
});

// --- Background Scheduler ---
const GOLDEN_RECIPE = {
    "cycle_id": "GROWTHCYCLE_SHADOW", "PhaseMinDur": 7, "PhaseMaxDur": 14, 
    "BT_FADE_TIME": 30, "AC_Temp_Day": 25, "AC_Temp_Night": 18, "Airflow": 100,
    "PUMP_ON_RATIO": 50, "Passing_Plt_Ht": 10, "Sunrise_T": 21600, "Sunset_T": 86400
};

async function syncDeviceSchedule() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const { startTime, endTime, manualPhase } = data.automation;
    const device = data.devices[0]; 
    if (!device) return;

    const isDay = (currentTime >= startTime && currentTime < endTime);
    console.log(`[Scheduler] Clock: ${currentTime} | Target: ${isDay ? 'DAY' : 'NIGHT'} (${manualPhase})`);

    try {
        if (isDay) {
            const phaseNum = (manualPhase === 'flower') ? '2' : '1';
            // SPECTRUM MIXING: 
            // Veg: 100% Cold, 0% Warm
            // Flower: 0% Cold, 100% Warm
            const coldVal = (manualPhase === 'veg') ? "FFFFFF" : "000000";
            const warmVal = (manualPhase === 'flower') ? "FFFFFF" : "000000";
            
            const recipe = { ...GOLDEN_RECIPE, "Cold_LED_BT": coldVal, "Warm_LED_BT": warmVal };
            
            await axios.post(`https://api.particle.io/v1/devices/${device.id}/updPhzInfo`, `arg=${JSON.stringify(recipe)}`, { headers: { 'Authorization': `Bearer ${device.access_token}`, 'Content-Type': 'application/x-www-form-urlencoded' } });
            await axios.post(`https://api.particle.io/v1/devices/${device.id}/goToPhzNum`, `arg=${phaseNum}`, { headers: { 'Authorization': `Bearer ${device.access_token}`, 'Content-Type': 'application/x-www-form-urlencoded' } });
            await axios.post(`https://api.particle.io/v1/devices/${device.id}/setSysMode`, `arg=Growing`, { headers: { 'Authorization': `Bearer ${device.access_token}`, 'Content-Type': 'application/x-www-form-urlencoded' } });
        } else {
            // Night: All 0
            const recipe = { ...GOLDEN_RECIPE, "Cold_LED_BT": "000000", "Warm_LED_BT": "000000" };
            await axios.post(`https://api.particle.io/v1/devices/${device.id}/updPhzInfo`, `arg=${JSON.stringify(recipe)}`, { headers: { 'Authorization': `Bearer ${device.access_token}`, 'Content-Type': 'application/x-www-form-urlencoded' } });
            await axios.post(`https://api.particle.io/v1/devices/${device.id}/goToPhzNum`, `arg=4`, { headers: { 'Authorization': `Bearer ${device.access_token}`, 'Content-Type': 'application/x-www-form-urlencoded' } });
            await axios.post(`https://api.particle.io/v1/devices/${device.id}/setSysMode`, `arg=0`, { headers: { 'Authorization': `Bearer ${device.access_token}`, 'Content-Type': 'application/x-www-form-urlencoded' } });
        }
    } catch (e) { console.error(`[Scheduler Error] -> ${e.message}`); }
}

// Check every 2 minutes to keep it persistent without spamming
// setInterval(syncDeviceSchedule, 120000);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`STILLGROWING PRO ONLINE ON PORT ${PORT}`);
});
