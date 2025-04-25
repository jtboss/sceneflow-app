/**
 * Helper script to save the moodboard images.
 * Instructions:
 * 1. Create a directory named 'moodboard-images' in this folder with your images
 * 2. Rename your images according to the mappings below
 * 3. Run this script with 'node scripts/save-images.js'
 */

const fs = require('fs');
const path = require('path');

// Define image mappings
const IMAGE_MAPPINGS = [
  { name: 'morning-selfie.jpg', description: 'The selfie with camera image from the collage' },
  { name: 'window-silhouette.jpg', description: 'The silhouette by window with coffee' },
  { name: 'washing-hands.jpg', description: 'The washing hands in sink image' },
  { name: 'coffee-closeup.jpg', description: 'The close-up of coffee cup by window' },
  { name: 'camera-selfie.jpg', description: 'The close-up self portrait with camera' },
  { name: 'window-view.jpg', description: 'The person looking out window image' },
];

// Source and destination paths
const sourceDir = path.join(__dirname, 'moodboard-images');
const destDir = path.join(__dirname, '../public/images/moodboard');

// Ensure the destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`Created directory: ${destDir}`);
}

// Check if source directory exists
if (!fs.existsSync(sourceDir)) {
  console.error(`Error: Please create a directory named 'moodboard-images' in the scripts folder and place your images there.`);
  process.exit(1);
}

// Copy the images
let copied = 0;
IMAGE_MAPPINGS.forEach(image => {
  const sourcePath = path.join(sourceDir, image.name);
  const destPath = path.join(destDir, image.name);
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied: ${image.name}`);
      copied++;
    } catch (err) {
      console.error(`❌ Error copying ${image.name}: ${err.message}`);
    }
  } else {
    console.warn(`⚠️ Warning: ${image.name} not found in source directory. Please add this image (${image.description}).`);
  }
});

console.log(`\nProcess complete. Copied ${copied} of ${IMAGE_MAPPINGS.length} images.`);
if (copied < IMAGE_MAPPINGS.length) {
  console.log('\nSome images are missing. Please add the missing images to the moodboard-images directory.');
  console.log('See the warnings above for details on which images are missing.');
} else {
  console.log('\nAll images have been copied successfully! 🎉');
} 