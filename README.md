# OpenMary: The Shadow Cloud Project 🌿☁️

Welcome to **OpenMary**, an open-source initiative to liberate Mary AG automated grow boxes from their dependency on proprietary cloud servers. This project provides a "Shadow Cloud" environment, custom firmware, and local control tools to keep your machine growing even if the manufacturer's servers disappear.

---

## 📖 The Story
Mary AG grow boxes are beautifully engineered but heavily reliant on a centralized cloud. When the cloud goes dark, or when you want privacy and local control, the machine becomes a "brick." 

We have successfully reverse-engineered the communication between the **Particle P1 (Brain)** and the **STM32 (Power Board)** to allow local overrides, custom schedules, and direct hardware control.

---

## 🏗 Hardware Architecture
*   **Main Brain:** Particle P1 (Wi-Fi enabled microcontroller).
*   **Power Board:** STM32-based controller managing high-voltage components (Lights, Pumps, Fans, Glass).
*   **Communication:** The P1 talks to the STM32 via `Serial1` (TX/RX) using a proprietary binary protocol.
*   **Telemetry:** Sensors (Temp, Humidity, Water Level) are read by the STM32 and passed back to the P1.

---

## ⚡ Firmware: The "OpenMary" Success
The factory firmware contains safety lockouts (door sensors, low water, fan errors) that prevent the machine from operating if any sensor reports an error. 

**The Breakthrough:** `openmary_surgical.bin`
*   **What it does:** This custom binary acts as a transparent bridge with "surgical" byte-splitting logic. It intercepts the factory control flow and allows us to inject manual commands while keeping the machine's safety watchdog satisfied.
*   **Requirement:** Your Particle P1 **MUST** be on Device OS **1.4.4**. Newer versions (3.x+) have been shown to cause boot loops with this specific implementation.

### Flashing Instructions
To flash the golden binary via USB (DFU mode):
```bash
sudo dfu-util -d 2b04:d008 -a 0 -s 0x80A0000:leave -D openmary_surgical.bin
```

---

## 📋 Prerequisites
Before you start, ensure you have the following installed:
*   **Node.js (v16+)** & **npm**
*   **Particle CLI** (`npm install -g particle-cli`)
*   **dfu-util** (for flashing the P1 over USB)
*   A Mary AG box with a Particle P1 on **Device OS 1.4.4**.

---

## 🚀 Quick Start
If you are ready to unlock your box immediately, use our automated setup script:
```bash
cd mary-shadow-cloud
chmod +x StillGrowing_Setup.sh
./StillGrowing_Setup.sh
```
This script will:
1.  Flash the unlocked firmware to your Mary Box via USB.
2.  Guide you through connecting the box to your local Wi-Fi.
3.  Launch the Shadow Cloud dashboard on port **3007**.

---

## 🛠 Configuration (data.json)
The `data.json` file is the brain of the Shadow Cloud. You can manually add your devices here:
```json
{
  "devices": [
    {
      "id": "YOUR_PARTICLE_ID",
      "name": "My Mary Box",
      "access_token": "YOUR_PARTICLE_ACCESS_TOKEN"
    }
  ]
}
```
*   **ID:** The 24-character Particle ID of your device.
*   **Access Token:** Your Particle personal access token (used for communicating with the P1).

---

## 🖥 The "Shadow Cloud" Dashboard
Our Node.js server acts as a local replacement for the Mary API. It translates standard Particle function calls into the specific commands needed to drive the machine.

### Key Features
*   **Local UI:** Monitor temperature, humidity, and water levels at `http://localhost:3007`.
*   **Manual Overrides:** Toggle Grow Lights, Air Pumps, and Electrochromic Glass.
*   **Schedule Sync:** A background worker that forces the machine into "Day" or "Night" modes regardless of its internal factory clock.

---

## 🎮 Golden Commands
These are the verified Particle functions available in the OpenMary firmware:

| Function | Args | Description |
| :--- | :--- | :--- |
| `setGrowLED` | `15,100` | Turn on Grow Lights (Full Brightness) |
| `setEglass` | `1` / `0` | Toggle Fog/Clear Glass |
| `setAirPump` | `100` / `0` | Control Air Stone (Oxygenation) |
| `setRGB` | `11,R,G,B` | Front LED accent colors |
| `setSysMode` | `Growing` | Standard Operation Mode |
| `updPhzInfo` | (JSON) | Update the internal recipe (Sunrise/Sunset) |

---

## 🗄 Research Archive
If you are diving deep into the code, you will find hundreds of historical binaries in this repository:
*   **`factory_freeze_*.bin`**: Dozens of attempts to "freeze" the factory watchdog at specific CPU clock speeds or memory states.
*   **`mary_bridge.ino` / `mary_sniffer.ino`**: The original logic used to sniff the Serial1 bus between the P1 and the STM32.
*   **`baud_hunter.py`**: A utility script used to find the non-standard baud rate (it's 115200, but with specific timing gaps required).

---

## 🚧 Current Challenges (Call for Contributors!)
While we have achieved light and pump control, we are still fighting the **STM32 Watchdog Override**:
1.  **The Night Lockout:** The STM32 has an internal clock that occasionally overrides our `setGrowLED` command if it thinks it is "Night Time."
2.  **Water Level Calibration:** Some units report `-1` for water levels even when full, triggering firmware safety halts.
3.  **Serial1 Protocol Mapping:** We are still mapping the full byte-map for secondary fans and individual LED channels.

---

## ⚠️ Safety Warning
*   **WATER PUMP:** The `setWaterPump` command initiates a drainage cycle. **DO NOT** run this without a hose attached to the drainage port, or you will flood the internals of your machine.
*   **DOOR SENSOR:** Bypassing safety checks means the grow lights (UV/High Intensity) may stay on while the door is open. Protect your eyes.

---

**Project Status (March 2026):** Functional Alpha. Join the movement to keep your Mary growing!
