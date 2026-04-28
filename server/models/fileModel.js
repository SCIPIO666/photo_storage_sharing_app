
const prisma = require('../config/prismaConfig');
const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

class FileModel {
  static async getUserFiles(userId, options = {}) {
    const { page = 1, limit = 20, folderId, search } = options;
    const skip = (page - 1) * limit;
    
    const where = { userId };
    if (folderId) where.folderId = folderId;
    if (folderId === 'null') where.folderId = null;
    if (search) {
      where.filename = { contains: search, mode: 'insensitive' };
    }
    
    try {
      const [files, total] = await Promise.all([
        prisma.file.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { folder: true }
        }),
        prisma.file.count({ where })
      ]);
      
      return {
        files,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error(`Error in getUserFiles: ${error.message}`);
      throw error;
    }
  }
  
  static async getFileById(fileId, userId) {
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
  
  static async deleteFile(fileId, userId) {
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
  
  static async deleteManyFiles(fileIds, userId) {
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
  
  static async updateFile(fileId, userId, updateData) {
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
  
  static async getStats(userId) {
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
}

module.exports = FileModel;