// scripts/clean-cloudinary.js
const cloudinary = require('../config/cloudinary')
const logger=require('../utils/logger')
async function cleanCloudinary() {
  console.log('🧹 Cleaning Cloudinary...');
  
  try {
    // Delete all images 
    const result = await cloudinary.api.delete_resources_by_prefix('media-storage/');
    console.log('✅ Cloudinary cleaned:', result);
  } catch (error) {
    console.log('No files to delete or error:', error.message);
  }
}

cleanCloudinary();