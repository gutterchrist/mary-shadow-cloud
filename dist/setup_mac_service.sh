#!/bin/bash
PLIST_FILE="$HOME/Library/LaunchAgents/ca.rightek.stillgrowing.plist"
CURRENT_DIR=$(pwd)
BINARY_PATH="$CURRENT_DIR/stillgrowing-macos"
cat <<EOF > "$PLIST_FILE"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>ca.rightek.stillgrowing</string>
    <key>ProgramArguments</key>
    <array><string>$BINARY_PATH</string></array>
    <key>RunAtLoad</key><true/>
    <key>KeepAlive</key><true/>
    <key>WorkingDirectory</key><string>$CURRENT_DIR</string>
</dict>
</plist>
EOF
launchctl load "$PLIST_FILE"
echo "SUCCESS! StillGrowing will start on login."