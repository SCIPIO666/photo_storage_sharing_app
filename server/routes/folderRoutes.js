const {Router}=require('express')
const folderRouter=Router()

folderRouter.post('/avatar')
folderRouter.post('/')
folderRouter.get('/:folderId')
folderRouter.get('/avatar')
folderRouter.put('/:folderId')
folderRouter.delete('/empty')
folderRouter.delete('/recursive/:folderId')
folderRouter.delete('/many')


module.exports=folderRouter
