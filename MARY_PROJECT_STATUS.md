# Mary AG "Shadow Cloud" Project Status - Feb 10, 2026

## 🛠 Current System State
- **Firmware:** `openmary_surgical.bin` (Modified Factory Firmware).
- **Status:** **ONLINE** (Particle Cloud & Local Dashboard).
- **Grow Lights:** **OFF** (Stuck in a safety/night lockout).
- **Dashboard:** Running on **Port 3007** (http://192.168.1.28:3007/).
- **Water Level:** Reporting `-1` (Hardware/Calibration issue).

## 🌟 Confirmed Controls
- **RGB Accent (Front):** Mask **15** (confirmed by user).
- **RGB Accent (Top):** Mask **10**.
- **Glass Control:** `setEglass` 1 (Clear) / 0 (Fog) — **WORKING**.
- **Air Pump:** `setAirPump` 100 (On) / 0 (Off) — **WORKING**.
- **Grow Lights:** `setGrowLED` 15,100 (On) / 15,0 (Off) — **FLAKY** (Watchdog overrides).

## 🛑 The "Watchdog" Conflict
The machine's internal STM32 mainboard has an automation loop that checks its internal clock. Even when we send a manual "ON" command, the machine sees it is "Night Time" and clicks them back off within a second.
- **Failed Attempts:** Setting `goToPhzNum(4)` or `goToPhzNum(1)` often returns `-1` (Busy).
- **Successful Trick:** Sending a full `updPhzInfo` recipe with `Sunrise_T: 0` and `Sunset_T: 86400` once turned them on, but the setting didn't "stick" after a server reboot.

## 📍 Where We Left Off
We are currently hunting for the exact command sequence to permanently bypass the night-time lockout. The user confirmed that "Cool Whites" were ON earlier today, but they were lost during a server transition.

## 🚀 Recovery Procedure
1. **Flash Golden Binary:** `sudo dfu-util -d 2b04:d008 -a 0 -s 0x80A0000:leave -D mary-shadow-cloud/openmary_surgical.bin`
2. **Reset Relays:** Enter `Watering` mode, then `exit_watering`.
3. **Force Phase:** Send `goToPhzNum(1)` (Vegetative).
4. **Boost Lights:** Send `setGrowLED(15,100)` repeatedly.
