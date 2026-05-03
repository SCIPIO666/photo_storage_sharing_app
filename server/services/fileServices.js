const fileModel = require('../models/fileModel');

async function createFile(filePath, userId, folderId) {
  return await fileModel.createFile(filePath, userId, folderId);
}

async function createUpdateAvatar(filePath, userId) {
  // triggers the model's upsert and the link to the User record
  return await fileModel.createUpdateAvatar(filePath, userId);
}

async function updateFile(fileId, userId, updateData) {
  return await fileModel.updateFile(fileId, userId, updateData);
}

async function getFolderFiles(folderId) {
  return await fileModel.getUserSingleFolderFiles(folderId);
}

async function getFileById(fileId, userId) {
  return await fileModel.getFileById(fileId, userId);
}

async function deleteFile(fileId, userId) {
  return await fileModel.deleteFile(fileId, userId);
}

async function deleteManyFiles(fileIds, userId) {
  return await fileModel.deleteManyFiles(fileIds, userId);
}

async function getFileStats(userId) {
  return await fileModel.getFileStats(userId);
}

module.exports = {
  createFile,
  createUpdateAvatar,
  updateFile,
  getFolderFiles,
  getFileById,
  deleteFile,
  deleteManyFiles,
  getFileStats
};