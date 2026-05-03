const { Router } = require('express');
const folderRouter = Router();
const folderController = require('../controllers/folderController');

// All folder routes should be protected
// router.use(protect);

// Stats and Bulk Actions
folderRouter.get('/stats', folderController.getFolderStats);
folderRouter.delete('/bulk-delete', folderController.deleteManyFolders);

// Avatar Folder Specialized Routes
folderRouter.route('/avatar')
  .get(folderController.handleAvatarFolder)
  .post(folderController.handleAvatarFolder);

// Standard CRUD
folderRouter.route('/')
  .get(folderController.getUserFolders)
  .post(folderController.createFolder);

folderRouter.route('/:folderId')
  .put(folderController.updateFolder)
  .delete(folderController.deleteFolderRecursively); // Using the recursive version by default

module.exports = folderRouter;
