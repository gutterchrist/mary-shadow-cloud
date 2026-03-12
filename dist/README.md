# 🌿 StillGrowing - Local Mary Control (v1.0)

StillGrowing is a local ecosystem for Mary AG grow boxes, created to ensure these devices keep thriving even after the original cloud services have ended.

**Developed by [Rightek](https://www.rightek.ca)**

## 🚀 Quick Start

### 1. Run the Control Center
Run the program for your OS:
- **Windows:** `stillgrowing-win.exe`
- **Linux:** `./stillgrowing-linux`
- **Mac:** `./stillgrowing-macos`

### 2. Connect & Control
Open **http://localhost:3000** in your browser.
- **Vitals:** View real-time Temperature, Humidity, and Water levels.
- **Controls:** Manually toggle Lights, Pumps, and E-Glass.
- **Journal:** Keep a local record of your plant's progress.

### 3. Mobile Access
Scan the **QR Code** on the "Connect" tab of the dashboard to open the Control Center on your iPhone or Android. **No app installation required!**

---

## 📂 Moving to a New System (Migration)
You can move StillGrowing to a new computer (like a Raspberry Pi or NAS) at any time, even in the middle of a grow!

1.  **Stop** the server on your current computer.
2.  **Copy** the entire folder to the new device.
3.  **Ensure** you include `data.json` and `history.json` (these contain your settings and logs).
4.  **Run** the binary on the new device. 
5.  *Note:* Your Mary box will keep its light/pump schedule internally while you move the server. No progress will be lost.

---

## 🛠 Advanced: Auto-Start on Boot
To make StillGrowing start automatically when your computer turns on:

| OS | Install Auto-Start | Uninstall / Remove |
| :--- | :--- | :--- |
| **Windows** | Run `Enable_AutoStart_Windows.bat` | Run `Disable_AutoStart_Windows.bat` |
| **Linux** | Run `sudo ./setup_linux_service.sh` | Run `sudo ./uninstall_linux_service.sh` |
| **Mac** | Run `./setup_mac_service.sh` | Run `./uninstall_mac_service.sh` |

---
*Support the mission: [www.rightek.ca](https://www.rightek.ca)*
