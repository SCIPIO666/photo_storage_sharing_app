
const { uploadToCloudinary } = require("../services/fileServices");
const logger = require('../utils/logger');
const prisma=require('../config/prismaConfig')


const uploadFile = async (req, res) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    const { title, folderId } = req.validatedBody || req.body;
    const userId = req.user?.id; //  user auth
    
    logger.info(`Processing ${files.length} file(s)`);
    
    if (files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "No files uploaded. Please upload files with field name 'photos'" 
      });
    }

    const uploadResults = [];
    
    for (const file of files) {
      try {
        // Uploading to Cloudinary
        logger.info(`Uploading ${file.originalname} to Cloudinary...`);
        const cloudRes = await uploadToCloudinary(file);
        
        // Saving to database
        const savedFile = await prisma.file.create({
          data: {
            url: cloudRes.secure_url,
            publicId: cloudRes.public_id,
            filename: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
            width: cloudRes.width || null,
            height: cloudRes.height || null,
            format: cloudRes.format,
            userId: userId, //  from auth
            folderId: folderId || null,
          },
          include: {
            folder: true
          }
        });
        
        logger.info(`Saved to database: ${savedFile.id}`);
        
        uploadResults.push({
          success: true,
          id: savedFile.id,
          filename: file.originalname,
          url: cloudRes.secure_url,
          public_id: cloudRes.public_id,
          size: file.size,
          mimeType: file.mimetype,
          format: cloudRes.format,
          width: cloudRes.width,
          height: cloudRes.height,
          folderId: savedFile.folderId,
          createdAt: savedFile.createdAt
        });
        
      } catch (fileError) {
        logger.error(`Failed to upload ${file.originalname}: ${fileError.message}`);
        uploadResults.push({
          success: false,
          filename: file.originalname,
          error: fileError.message
        });
      }
    }
    
    const successCount = uploadResults.filter(r => r.success).length;
    
    return res.json({
      success: true,
      message: `${successCount} of ${files.length} file(s) uploaded successfully`,
      files: uploadResults,
      metadata: { title, folderId }
    });
    
  } catch (err) {
    logger.error(`Upload controller error: ${err.message}`);
    res.status(500).json({ 
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

async function getFiles(req, res){
    try {
        
    } catch (error) {
        
    }
}
async function deleteFile(req, res){
    try {
        
    } catch (error) {
        
    }
}
async function updateFileDetails(req, res){
    try {
        
    } catch (error) {
        
    }
}

module.exports = { uploadFile };