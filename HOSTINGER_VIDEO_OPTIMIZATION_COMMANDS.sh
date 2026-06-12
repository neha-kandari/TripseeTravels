# Video Optimization Commands for Hostinger VPS
# Run these commands on your Hostinger server

# Install FFmpeg if not already installed
sudo apt update
sudo apt install ffmpeg -y

# Create optimized videos directory
mkdir -p /var/www/html/optimized-videos

# Optimize videos (run from your project directory)
cd /var/www/html

# Optimize feedback videos
for file in public/Feedback/*.mp4; do
  filename=$(basename "$file")
  ffmpeg -i "$file" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart "public/optimized-videos/$filename" -y
done

# Optimize main video
ffmpeg -i public/videos/tripsee.mp4 -c:v libx264 -crf 25 -preset medium -c:a aac -b:a 128k -movflags +faststart public/optimized-videos/tripsee.mp4 -y

# Set proper permissions
chmod 644 public/optimized-videos/*.mp4
chown www-data:www-data public/optimized-videos/*.mp4

# Test video loading
curl -I https://yourdomain.com/optimized-videos/tripsee.mp4
