const {Router}=require('express')
const fileRouter=Router()
const fileController=require('../controllers/fileController')

fileRouter.post('/',fileController.createFile)
fileRouter.post('/avatar',fileController.createupdateAvatar)
fileRouter.put('/:fileId',fileController.updateFile)
fileRouter.get('/:folderId',fileController.getFolderFiles)
fileRouter.get('/avatar',fileController.getAvatar)
fileRouter.delete('/:fileId',fileController.deleteFile)

module.exports=fileRouter