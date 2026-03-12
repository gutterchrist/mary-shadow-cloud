#!/bin/bash
if [[ $EUID -ne 0 ]]; then echo "Use sudo"; exit 1; fi
systemctl stop stillgrowing
systemctl disable stillgrowing
rm -f /etc/systemd/system/stillgrowing.service
systemctl daemon-reload
echo "SUCCESS! StillGrowing removed."