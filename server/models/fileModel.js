const prisma = require('../config/prismaConfig');
const cloudinaryModel = require('./cloudinaryUploadModel');
const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

async function createFile(filePath, userId, folderId) {
    try {
        const result = await cloudinaryModel.uploadMediaFile(filePath, userId);
        return await prisma.file.create({
            data: {
                fileName: result.original_filename,
                url: result.secure_url,
                publicId: result.public_id,
                type: "OTHER",
                userId: userId,
                folderId: folderId || null,
            }
        });
    } catch (error) {
        logger.error(`error: ${error.message}`);
        throw error;
    }
}

async function createUpdateAvatar(filePath, userId) {
    try {
        const result = await cloudinaryModel.uploadUserAvatar(filePath, userId);
        const avatarFile = await prisma.file.upsert({
            where: { publicId: result.public_id }, 
            update: {
                url: result.secure_url,
                fileName: result.original_filename,
                updatedAt: new Date(),
            },
            create: {
                fileName: result.original_filename, 
                url: result.secure_url,
                publicId: result.public_id,
                type: "AVATAR",
                userId: userId
            }
        });

        await prisma.user.update({
            where: { id: userId },
            data: { avatarId: avatarFile.id }
        });

        return avatarFile;
    } catch (error) {
        logger.error(`error: ${error.message}`);
        throw error;
    }
}

async function updateFile(fileId, userId, updateData = {}) {
    try {
        return await prisma.file.update({
            where: { id: fileId, userId },
            data: {
                ...updateData,
                updatedAt: new Date()
            },
            include: { folder: true }
        });
    } catch (error) {
        logger.error(`Error in updateFile: ${error.message}`);
        throw error;
    }
}

async function getUserSingleFolderFiles(folderId) {
    try {
        return await prisma.file.findMany({ where: { folderId: folderId } });
    } catch (error) {
        logger.error(`error: ${error.message}`);
        throw error;
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
        const file = await getFileById(fileId, userId);
        await cloudinary.uploader.destroy(file.publicId);

        return await prisma.file.delete({ where: { id: fileId } });
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

        const cloudinaryDeletions = files.map(file =>
            cloudinary.uploader.destroy(file.publicId).catch(err =>
                logger.error(`Cloudinary error: ${file.publicId}`, err)
            )
        );
        await Promise.all(cloudinaryDeletions);

        return await prisma.file.deleteMany({
            where: { id: { in: fileIds }, userId }
        });
    } catch (error) {
        logger.error(`Error in deleteManyFiles: ${error.message}`);
        throw error;
    }
}

async function getFileStats(userId) {
    try {
        const stats = await prisma.file.aggregate({
            where: { userId },
            _count: true,
            _sum: { size: true }
        });
        return { totalFiles: stats._count, totalSize: stats._sum.size || 0 };
    } catch (error) {
        logger.error(`Error in getFileStats: ${error.message}`);
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
    getFileStats
};