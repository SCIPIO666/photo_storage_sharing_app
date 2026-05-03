const folderModel = require('../models/folderModel');

/**
 * FOLDER SERVICE
 * Orchestrates calls to the Prisma Model. 
 * Errors bubble up to the Controller.
 */

async function createFolder(userId, name, parentId = null) {
  // Logic: The model expects (userId, name, parentId)
  return await folderModel.createFolder(userId, name, parentId);
}

async function getUserFolders(userId, rootOnly = false) {
  return await folderModel.getUserFolders(userId, rootOnly);
}

async function getFolderById(folderId, userId) {
  return await folderModel.getFolderById(folderId, userId);
}

async function deleteEmptyFolder(folderId, userId) {
  // Logic: The model will throw "Folder is not empty" if children/files exist
  return await folderModel.deleteEmptyFolder(folderId, userId);
}

async function deleteFolderRecursively(folderId) {

  return await folderModel.deleteFolderRecursively(folderId);
}

async function deleteManyFolders(folderIds, userId) {

  return await folderModel.deleteManyFolders(folderIds, userId);
}

async function updateFolder(folderId, userId, updatedData) {

  return await folderModel.updateFolder(folderId, userId, updatedData);
}

async function getFolderStats(userId) {
  return await folderModel.getFolderStats(userId);
}

/** 
 * SPECIALIZED LOGIC
 * existing model methods with specific context
 */

async function createAvartarFolder(userId) {
  // Business Rule: Avatar folders are always named "Avatars" and are root level
  return await folderModel.createFolder(userId, 'Avatars', null);
}

async function getAvatarFolder(userId) {
  const folders = await folderModel.getUserFolders(userId);
  return folders.find(f => f.name === 'Avatars');
}

async function deleteAvatarFolder(userId) {
  const avatarFolder = await getAvatarFolder(userId);
  if (avatarFolder) {
    // Using recursive deletion to ensure all previous avatars are wiped from Cloudinary
    return await folderModel.deleteFolderRecursively(avatarFolder.id);
  }
  return { message: "No avatar folder found" };
}

module.exports = {
  createFolder,
  getUserFolders,
  getFolderById,
  deleteEmptyFolder,
  deleteFolderRecursively,
  deleteManyFolders,
  updateFolder,
  getFolderStats,
  createAvartarFolder,
  getAvatarFolder,
  deleteAvatarFolder
};