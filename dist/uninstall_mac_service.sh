#!/bin/bash
PLIST_FILE="$HOME/Library/LaunchAgents/ca.rightek.stillgrowing.plist"
if [ -f "$PLIST_FILE" ]; then
    launchctl unload "$PLIST_FILE"
    rm -f "$PLIST_FILE"
    echo "SUCCESS! StillGrowing removed."
else
    echo "Not found."
fi