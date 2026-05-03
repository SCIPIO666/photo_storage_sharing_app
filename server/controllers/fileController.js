const fileService = require('../services/fileService');

async function uploadFile(req, res, next) {
  try {
    const { folderId } = req.body;
    const userId = req.user.id;
    // req.file.path --- from multer middleware
    const file = await fileService.createFile(req.file.path, userId, folderId);
    res.status(201).json({ success: true, data: file });
  } catch (error) {
    next(error);
  }
}

async function updateAvatar(req, res, next) {
  try {
    const userId = req.user.id;
    const avatar = await fileService.createUpdateAvatar(req.file.path, userId);
    res.status(200).json({ success: true, data: avatar });
  } catch (error) {
    next(error);
  }
}

async function getFileDetails(req, res, next) {
  try {
    const file = await fileService.getFileById(req.params.fileId, req.user.id);
    res.status(200).json({ success: true, data: file });
  } catch (error) {
    next(error);
  }
}

async function removeFile(req, res, next) {
  try {
    await fileService.deleteFile(req.params.fileId, req.user.id);
    res.status(200).json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    next(error);
  }
}

async function getStats(req, res, next) {
  try {
    const stats = await fileService.getFileStats(req.user.id);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadFile,
  updateAvatar,
  getFileDetails,
  removeFile,
  getStats
};

