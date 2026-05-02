
const prisma = require('../config/prismaConfig');
const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

     async function createFolder(){

    }
   async function getUserFolders(userId, options = {}) {
    try{
    const userFolders= await prisma.folder.findMany({
        where: {userId: userId  }
    })
    
    } catch (error) {
      logger.error(`Error in getUserFiles: ${error.message}`);
      throw error;
    }
  }
  
   async function getFolderById(fileId, userId) {
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
  
   async function deleteFolder(fileId, userId) {
    try {
      const file = await this.getFileById(fileId, userId);
      
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
  
   async function deleteManyFolders(fileIds, userId) {
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
  
   async function updateFolder(fileId, userId, updateData) {
    try {
      await this.getFileById(fileId, userId);
      
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



module.exports = FolderModel;