#!/bin/bash
echo "Starting StillGrowing Keep-Alive Watcher..."
until cd /home/brad/mary-shadow-cloud && node index.js; do
    echo "Server crashed with exit code $?. Respawning in 2 seconds..." >&2
    sleep 2
done
