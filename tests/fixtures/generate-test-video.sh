#!/bin/bash
# Generate test video for fake webcam in Playwright tests
# This creates a Y4M video file that Chrome can use with --use-file-for-fake-video-capture

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_FILE="$SCRIPT_DIR/test-video.y4m"

# Check if ffmpeg is available
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is required but not installed."
    exit 1
fi

# Generate a 2-second test video at 320x240, 15fps
# Color matches the app's dark theme background
echo "Generating test video at $OUTPUT_FILE..."
ffmpeg -y -f lavfi -i "color=c=0x1a1a2e:s=320x240:r=15:d=2" \
    -pix_fmt yuv420p \
    "$OUTPUT_FILE" 2>/dev/null

if [ -f "$OUTPUT_FILE" ]; then
    echo "✅ Test video generated successfully: $(ls -lh "$OUTPUT_FILE" | awk '{print $5}')"
else
    echo "❌ Failed to generate test video"
    exit 1
fi
