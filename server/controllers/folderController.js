const folderService=require('../services/folderService')
const logger=require('../utils/logger')


async function createFolder(req, res, next) {
  try {
    const { name, parentId } = req.body;
    const userId = req.user.id; 
    const folder = await folderService.createFolder(userId, name, parentId);
    res.status(201).json({ success: true, data: folder });
  } catch (error) {
    next(error);
  }
}

async function updateFolder(req, res, next) {
  try {
    const { folderId } = req.params;
    const userId = req.user.id;
    const updatedFolder = await folderService.updateFolder(folderId, userId, req.body);
    res.status(200).json({ success: true, data: updatedFolder });
  } catch (error) {
    next(error);
  }
}

async function getUserFolders(req, res, next) {
  try {
    const userId = req.user.id;
    const rootOnly = req.query.root === 'true'; // Allow toggling via query param
    const folders = await folderService.getUserFolders(userId, rootOnly);
    res.status(200).json({ success: true, data: folders });
  } catch (error) {
    next(error);
  }
}

async function deleteFolderRecursively(req, res, next) {
  try {
    const { folderId } = req.params;
    await folderService.deleteFolderRecursively(folderId);
    res.status(200).json({ success: true, message: "Folder and all contents deleted" });
  } catch (error) {
    next(error);
  }
}

async function deleteManyFolders(req, res, next) {
  try {
    const { folderIds } = req.body; 
    const userId = req.user.id;
    const result = await folderService.deleteManyFolders(folderIds, userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function getFolderStats(req, res, next) {
  try {
    const userId = req.user.id;
    const stats = await folderService.getFolderStats(userId);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}

// Avatar Folder Handlers
async function handleAvatarFolder(req, res, next) {
  try {
    const userId = req.user.id;
    let folder;
    if (req.method === 'POST') {
      folder = await folderService.createAvartarFolder(userId);
    } else {
      folder = await folderService.getAvatarFolder(userId);
    }
    res.status(200).json({ success: true, data: folder });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createFolder,
  updateFolder,
  getUserFolders,
  deleteFolderRecursively,
  deleteManyFolders,
  getFolderStats,
  handleAvatarFolder
};