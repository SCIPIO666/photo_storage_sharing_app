// routes/fileRouter.js
const { Router } = require('express');
const upload = require('../config/multer');
const fileRouter = Router();
const multer = require('multer');
const { fileUploadSchema } = require('../schemas/fileSchema');
const validate = require('../validators/fileValidator');
const logger = require('../utils/logger');
const fileController = require('../controllers/fileController');
const fileModel = require('../models/fileModel');
const { protectDev, restrictTo } =require('../middleware/authMidleware')

// All routes require authentication
fileRouter.use(protectDev);



//upload file/files
fileRouter.post('/',
  (req, res, next) => {
    upload.array('photos', 5)(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          logger.error(`Multer error: ${err.message}`);
          return res.status(400).json({ error: err.message, code: err.code });
        }
        logger.error(`Unknown error: ${err.message}`);
        return res.status(500).json({ error: err.message });
      }
      next();
    });
  },
  validate(fileUploadSchema),
  fileController.uploadFile
);

// Get all files (with pagination and filtering)
fileRouter.get('/', async (req, res) => {
  try {
    const { page, limit, folderId, search } = req.query;
    const result = await FileModel.getUserFiles(req.user.id, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      folderId,
      search
    });
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    logger.error(`Error fetching files: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single file
fileRouter.get('/:id', async (req, res) => {
  try {
    const file = await FileModel.getFileById(req.params.id, req.user.id);
    res.json({ success: true, file });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

// Delete file
fileRouter.delete('/:id',  async (req, res) => {
  try {
    const deletedFile = await fileModel.deleteFile(req.params.id, req.user.id);
    res.json({
      success: true,
      message: 'File deleted successfully',
      file: deletedFile
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete multiple files
fileRouter.delete('/',  async (req, res) => {
  try {
    const { fileIds } = req.body;
    if (!fileIds || !Array.isArray(fileIds)) {
      return res.status(400).json({ success: false, error: 'fileIds array required' });
    }
    
    const result = await fileModel.deleteManyFiles(fileIds, req.user.id);
    res.json({
      success: true,
      message: `${result.deletedCount} file(s) deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update file (move to folder or rename)
fileRouter.patch('/:id',  async (req, res) => {
  try {
    const { filename, folderId } = req.body;
    const updatedFile = await fileModel.updateFile(req.params.id, req.user.id, {
      filename,
      folderId
    });
    
    res.json({
      success: true,
      message: 'File updated successfully',
      file: updatedFile
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get file statistics
fileRouter.get('/stats/overview', async (req, res) => {
  try {
    const stats = await fileModel.getStats(req.user.id);
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = fileRouter;