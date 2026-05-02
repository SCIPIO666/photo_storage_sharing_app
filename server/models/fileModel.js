
const prisma = require('../config/prismaConfig');
const cloudinaryModel=require('./cloudinaryUploadModel')
const logger = require('../utils/logger');



   async function createFile(filePath,userId,folderId){
     try {
              const result =await cloudinaryModel.uploadMediaFile(filePath,userId)

              const mediaFile= await prisma.file.create({
                  data: {
                    fileName: result.original_filename,
                    url: result.secure_url,
                    publicId: result.public_id,
                    type: "OTHER",
                    userId: userId,
                    folderId: folderId || null,
                  }
              })

              return mediaFile

      } catch (error) {
        logger.error(`error: ${error.message}`)
        throw error
      }
  }
   async function createUpdateAvatar(filePath,userId){

      try {
              const result =await cloudinaryModel.uploadUserAvatar(filePath,userId)
              const avatarFile= await prisma.file.upsert({
                where: {publicId: result.public_id},
                update: {
                  url: result.secure_url,
                  fileName: result.original_filename,
                  updatedAt: new Date(),
                },
                create: {
                    filename: result.original_filename,
                    url: result.secure_url,
                    publicId: result.public_id,
                    type: "AVATAR",
                    userId: userId
                }
              })

              //link avatar to user
              await prisma.user.update({
                where: {id: userId},
                data: {avatarId: avatarFile.id}
              })

              return avatarFile

      } catch (error) {
        logger.error(`error: ${error.message}`)
        throw error
      }
  }

  async function updateFile(fileId, userId, updateData) {
    try {
      await getFileById(fileId, userId);
      
      const updatedFile = await prisma.file.update({
        where: { id: fileId },
        data: {
          filename: updateData.filename,
          folderId: updateData.folderId
        },
        include: { folder: true }
      });
      
      return updatedFile;
    } catch (error) {
      logger.error(`Error in updateFile: ${error.message}`);
      throw error;
    }
  }
   async function getUserSingleFolderFiles(folderId) {
    try {
      const files= await prisma.file.findMany({
        where:{folderId: folderId}
      })
      return files
    } catch (error) {
      logger.error(`error: ${error.message}`)
      throw error
    }
  }
  
   async function getFileById(fileId, userId) {
    try {
      const file = await prisma.file.findFirst({
        where: { id: fileId, userId },
        include: { folder: true }
      });
      
      if (!file) throw new Error('File not found');
      return file;
    } catch (error) {
      logger.error(`Error in getFileById: ${error.message}`);
      throw error;
    }
  }
  
   async function deleteFile(fileId, userId) {
    try {
      const file = await this.getFileById(fileId, userId)    
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(file.publicId);
      logger.info(`Deleted from Cloudinary: ${file.publicId}`);
      
      // Delete from database
      const deletedFile = await prisma.file.delete({
        where: { id: fileId }
      });
      
      return deletedFile;
    } catch (error) {
      logger.error(`Error in deleteFile: ${error.message}`);
      throw error;
    }
  }
  
   async function deleteManyFiles(fileIds, userId) {
    try {
      const files = await prisma.file.findMany({
        where: { id: { in: fileIds }, userId }
      });
      
      if (files.length !== fileIds.length) {
        throw new Error('Some files not found or unauthorized');
      }
      
      // Delete from Cloudinary (parallel)
      const cloudinaryDeletions = files.map(file => 
        cloudinary.uploader.destroy(file.publicId).catch(err => 
          logger.error(`Failed to delete from Cloudinary: ${file.publicId}`, err)
        )
      );
      await Promise.all(cloudinaryDeletions);
      
      // Delete from database
      const result = await prisma.file.deleteMany({
        where: { id: { in: fileIds } }
      });
      
      return { deletedCount: result.count, files };
    } catch (error) {
      logger.error(`Error in deleteManyFiles: ${error.message}`);
      throw error;
    }
  }
  
   async function getStats(userId) {
    try {
      const stats = await prisma.file.aggregate({
        where: { userId },
        _count: true,
        _sum: { size: true },
        _avg: { size: true }
      });
      
      const byType = await prisma.file.groupBy({
        by: ['mimeType'],
        where: { userId },
        _count: true,
        _sum: { size: true }
      });
      
      return {
        totalFiles: stats._count,
        totalSize: stats._sum.size || 0,
        averageSize: stats._avg.size || 0,
        byType
      };
    } catch (error) {
      logger.error(`Error in getStats: ${error.message}`);
      throw error;
    }
  }




module.exports = {
  createFile,
  createUpdateAvatar,
  updateFile,
  getUserSingleFolderFiles,
  getFileById,
  deleteFile,
  deleteManyFiles,
  getStats
}