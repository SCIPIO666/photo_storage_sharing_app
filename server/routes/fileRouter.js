const {Router}=require('express')
const fileRouter=Router()

fileRouter.post('/avatar')
fileRouter.post('/')
fileRouter.get('/:folderId')
fileRouter.get('/avatar')
fileRouter.put('/:folderId')
fileRouter.delete('/empty')
fileRouter.delete('/recursive/:folderId')
fileRouter.delete('/many')


module.exports=fileRouter