#!/bin/bash
echo "--- Mary Auto-Detect Setup ---"
# sec=0 tells the box to figure out the security on its own
curl -X POST http://192.168.0.1/configure-ap -d "idx=0&ssid=TELUS1136&sec=0&ch=0&pwd=f5hjbs599q"
echo "Auto-detect config sent."

curl -X POST http://192.168.0.1/connect-ap -d "idx=0"
echo "Connect sent."
