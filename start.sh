#!/bin/bash

echo "Starting flipboard + plane tracker..."

# Activate virtual environment
source venv/bin/activate

# Start HTTP server in background
python3 server.py &
SERVER_PID=$!
sleep 1

echo "Server running at http://localhost:8080"
echo "Tracking planes every 15s. Press Ctrl+C to stop."

trap "kill $SERVER_PID; exit" INT

while true; do
  python3 nearest_plane.py
  sleep 15
done