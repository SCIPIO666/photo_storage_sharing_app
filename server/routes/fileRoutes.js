const {Router}= require('express')

const fileRouter=Router()
const multer  = require('multer')
const upload = multer({ dest: 'uploads/',
     limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size (in bytes)
    files: 4, // Max number of files 
    fieldSize: 10 * 1024 * 1024, // Max size (10MB)
    fieldNameSize: 100, // Max 100 bytes
    parts: 10, // Max number of parts (fields + files)
    headerPairs: 2000 // Max number of header key-value pairs
  }
 })
const fileController=require('../controllers/fileController')
fileRouter.post('/',upload.array('photos', 4),fileController.uploadFile)


module.exports=fileRouter