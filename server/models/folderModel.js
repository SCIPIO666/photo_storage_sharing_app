const prisma = require('../config/prismaConfig');
const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

async function collectFolderIds(folderId) {
    try {
        const children = await prisma.folder.findMany({
            where: { parentId: folderId },
            select: { id: true }
        });

        let allIds = [folderId];
        for (let child of children) {
            const childIds = await collectFolderIds(child.id);
            allIds = allIds.concat(childIds);
        }
        return allIds;
    } catch (error) {
        logger.error(`error: ${error.message}`);
        throw error;
    }
}

async function createFolder(userId, name, parentId) {
    try {
        const newFolder = await prisma.folder.create({
            data: {
                name,
                userId,
                parentId: parentId || null // Fixed: was options.parentId
            }
        });
        return newFolder;
    } catch (error) {
        logger.error(`error: ${error.message}`);
        throw error; //Always throwing in model ,error bubbles upwards
    }
}

async function getUserFolders(userId, rootOnly = false) {
    try {
        const userFolders = await prisma.folder.findMany({
            where: {
                userId,
                parentId: rootOnly ? null : undefined,
            },
            include: {
                children: true,
                files: true
            }
        });
        return userFolders;
    } catch (error) {
        logger.error(`Error in getUserFolders: ${error.message}`);
        throw error;
    }
}

async function getFolderById(folderId, userId) {
    try {
        const folder = await prisma.folder.findFirst({ // Fixed variable name to folder
            where: { id: folderId, userId },
            include: { files: true }
        });
        if (!folder) throw new Error('Folder not found');
        return folder;
    } catch (error) {
        logger.error(`Error in getFolderById: ${error.message}`);
        throw error;
    }
}

async function deleteEmptyFolder(folderId, userId) {
    try {
        const folder = await prisma.folder.findUnique({
            where: { id: folderId }, 
            include: {
                children: true,
                files: true
            }
        });
        
        if (!folder || folder.userId !== userId) throw new Error("Unauthorized or not found");
        if (folder.children.length > 0 || folder.files.length > 0) {
            throw new Error("Folder is not empty");
        }

        return await prisma.folder.delete({ where: { id: folderId } });
    } catch (error) {
        logger.error(`Error in deleteEmptyFolder: ${error.message}`);
        throw error;
    }
}

async function deleteFolderRecursively(folderId) { 
    
    const childFolders = await prisma.folder.findMany({
        where: { parentId: folderId },
        select: { id: true }
    });

    for (let child of childFolders) {
        await deleteFolderRecursively(child.id);
    }

    const deleteFiles = await prisma.file.findMany({
        where: { folderId },
        select: { id: true, publicId: true }
    });

    await Promise.all(
        deleteFiles.map(file => cloudinary.uploader.destroy(file.publicId))
    );

    await prisma.file.deleteMany({ where: { folderId } });
    return await prisma.folder.delete({ where: { id: folderId } });
}

async function deleteManyFolders(folderIds, userId) {
    try {
        let allFolderIds = [];
        for (const folderId of folderIds) {
            const ids = await collectFolderIds(folderId);
            allFolderIds = allFolderIds.concat(ids);
        }
        allFolderIds = Array.from(new Set(allFolderIds));

        const files = await prisma.file.findMany({
            where: { folderId: { in: allFolderIds }, userId },
            select: { publicId: true }
        });

        await Promise.all(files.map(file => cloudinary.uploader.destroy(file.publicId)));

        return await prisma.folder.deleteMany({
            where: { id: { in: allFolderIds }, userId }
        });
    } catch (error) {
        logger.error(`Error in deleteManyFolders: ${error.message}`);
        throw error;
    }
}

async function updateFolder(folderId, userId, updateData = {}) { 
    try {
        return await prisma.folder.update({
            where: { id: folderId, userId }, 
            data: {
                ...updateData,
                updatedAt: new Date()
            },
            include: { files: true }
        });
    } catch (error) {
        logger.error(`Error in updateFolder: ${error.message}`);
        throw error;
    }
}

async function getFolderStats(userId) {
    try {
        const stats = await prisma.folder.aggregate({
            where: { userId },
            _count: true
        });
        return { totalFolders: stats._count };
    } catch (error) {
        logger.error(`Error in getFolderStats: ${error.message}`);
        throw error;
    }
}

module.exports = {
    createFolder,
    getUserFolders,
    getFolderById,
    deleteEmptyFolder,
    deleteFolderRecursively,
    deleteManyFolders,
    updateFolder,
    getFolderStats
};