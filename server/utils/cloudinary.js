
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

class CloudinaryService {
  /**
   * Upload a buffer directly to Cloudinary via stream
   * @param {Buffer} buffer - File buffer from multer
   * @param {string} userId - For folder isolation (multi‑tenant)
   * @param {string} albumId - Optional subfolder
   * @returns {Promise<{url: string, publicId: string}>}
   */
  static async uploadImage(buffer, userId, albumId = null) {
    return new Promise((resolve, reject) => {
      const folderPath = `media-storage/${userId}${albumId ? `/albums/${albumId}` : ''}`;
      
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderPath,
          resource_type: 'image',
          allowed_formats: ['jpg', 'png', 'webp', 'gif'],
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  /**
   * Delete an image from Cloudinary
   * @param {string} publicId
   */
  static async deleteImage(publicId) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, { resource_type: 'image' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}

module.exports = CloudinaryService;