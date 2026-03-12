#!/bin/bash
echo "=========================================="
echo "🌿 StillGrowing Pro - Automatic Unlocker"
echo "=========================================="
echo "1. Connect your Mary box via USB."
echo "2. Hold RESET + MODE, release RESET, wait for YELLOW blinking."
echo "3. Press Enter when yellow light is blinking."
read p

echo "
📡 Step 1: Flashing Unlocked Firmware..."
# Ensure particle-cli is installed (npm install -g particle-cli)
particle flash --usb ./openmary_surgical.bin

echo "
📶 Step 2: Connecting to Wi-Fi..."
particle serial wifi

echo "
✅ Step 3: Launching Dashboard..."
node index.js &
echo "
🎉 SUCCESS! Open http://localhost:3007 in your browser."
