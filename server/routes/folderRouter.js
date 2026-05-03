const {Router}=require('express')
const folderRouter=Router()
const folderController=require('../controllers/folderController')
const fileRouter = require('./exfile')

folderRouter.post('/',folderController.createFolder)
folderRouter.get('/',folderController.getUserFolders)
folderRouter.put('/:folderId',folderController.updateFolder)
folderRouter.delete('/empty',folderController.deleteEmptyFolder)
folderRouter.delete('/recursive/:folderId',folderController.deletFolderRecursively)
folderRouter.delete('/many',folderController.deletManyFolders)
folderRouter.get('/avatar',folderController.getAvatarFolder)
folderRouter.post('/avatar',folderController.createAvartarFolder)
folderRouter.update('/avatar',folderController.updateAvatarFolder)
folderRouter.delete('/avatar',folderController.deleteAvatarFolder)

module.exports=folderRouter
