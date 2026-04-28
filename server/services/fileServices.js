
const cloudinary = require("../config/cloudinary");
const stream = require('stream');

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    //  if file has buffer (memory storage) or path (disk storage)
    if (file.buffer) {
      // Memory storage
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          resource_type: "auto",
          folder: "uploads",
          allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp']
        }, 
        (error, result) => {
          if (error) {
            console.error('Cloudinary error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      // Creating a readable stream from buffer and pipe to uploadStream
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(uploadStream);
      
    } else if (file.path) {
      // Disk storage
      cloudinary.uploader.upload(
        file.path,
        { 
          resource_type: "auto",
          folder: "uploads"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    } else {
      reject(new Error('Invalid file object: no buffer or path'));
    }
  });
};

module.exports = { uploadToCloudinary };