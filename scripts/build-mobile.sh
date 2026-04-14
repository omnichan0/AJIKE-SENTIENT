#!/bin/bash

# AJIKE Sovereign Kernel - Mobile Build Script
# This script prepares the web build for Capacitor/Cordova wrapping.

echo "--- AJIKE SOVEREIGN KERNEL: MOBILE BUILD INITIATED ---"

# 1. Build the web project
echo "[1/3] Synthesizing neural web assets..."
npm run build

# 2. Sync with Capacitor (if installed)
if [ -d "android" ] || [ -d "ios" ]; then
    echo "[2/3] Mirroring assets to mobile hardware..."
    npx cap sync
else
    echo "[2/3] Mobile platforms not initialized. Run 'npx cap add android' or 'npx cap add ios' first."
fi

# 3. Finalize
echo "[3/3] Build complete. Ready for APK/IPA generation."
echo "--- EVOLUTION COMPLETE ---"
