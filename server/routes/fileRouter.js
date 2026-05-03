const { Router } = require('express');
const fileRouter = Router();
const fileController = require('../controllers/fileController');
const upload = require('../middleware/multer'); // Middleware to handle file buffers
// const { protect } = require('../middleware/authMiddleware');

// router.use(protect); // All file operations require login

// Stats
fileRouter.get('/stats', fileController.getStats);

// Uploads
fileRouter.post('/upload', upload.single('file'), fileController.uploadFile);
fileRouter.post('/avatar', upload.single('avatar'), fileController.updateAvatar);

// Individual File Operations
fileRouter.route('/:fileId')
  .get(fileController.getFileDetails)
  .delete(fileController.removeFile);

module.exports = fileRouter;