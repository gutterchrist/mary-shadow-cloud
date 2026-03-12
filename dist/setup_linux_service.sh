#!/bin/bash
SERVICE_FILE="/etc/systemd/system/stillgrowing.service"
CURRENT_DIR=$(pwd)
BINARY_PATH="$CURRENT_DIR/stillgrowing-linux"
if [[ $EUID -ne 0 ]]; then echo "Use sudo"; exit 1; fi
cat <<EOF > $SERVICE_FILE
[Unit]
Description=StillGrowing Control Center
After=network.target
[Service]
ExecStart=$BINARY_PATH
WorkingDirectory=$CURRENT_DIR
Restart=always
User=$USER
[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable stillgrowing
systemctl start stillgrowing
echo "SUCCESS! StillGrowing is running in the background."