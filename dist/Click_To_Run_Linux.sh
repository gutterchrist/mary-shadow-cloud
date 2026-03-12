#!/bin/bash
# StillGrowing Linux Launcher

# 1. Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

# 2. Ensure the binary has permission to run
chmod +x ./stillgrowing-linux

# 3. Open the browser in the background after a 2-second delay
(sleep 2 && xdg-open http://localhost:3000) &

# 4. Start the server
echo "Starting StillGrowing Control Center..."
./stillgrowing-linux
