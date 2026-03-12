#!/bin/bash
# This script installs a clickable icon on your Linux Desktop

CURRENT_DIR=$(pwd)
DESKTOP_DIR="$HOME/Desktop"
ICON_PATH="$DESKTOP_DIR/StillGrowing.desktop"

echo "Creating Desktop Icon..."

cat <<EOF > "$ICON_PATH"
[Desktop Entry]
Version=1.0
Type=Application
Name=StillGrowing
Comment=Control your Mary AG box locally
Exec=$CURRENT_DIR/Click_To_Run_Linux.sh
Icon=utilities-terminal
Terminal=true
Categories=Utility;
EOF

chmod +x "$ICON_PATH"
chmod +x "$CURRENT_DIR/Click_To_Run_Linux.sh"
chmod +x "$CURRENT_DIR/stillgrowing-linux"

echo "SUCCESS! You now have a 'StillGrowing' icon on your desktop."
echo "You can now close this terminal and double-click the icon to start."
