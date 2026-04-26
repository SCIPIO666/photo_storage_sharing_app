const {Router}= require('express')
const upload=require('../config/multer')
const fileRouter=Router()
const multer  = require('multer')

const fileController=require('../controllers/fileController')

fileRouter.post('/', (req, res, next) => {
  upload.array('photos', 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred
      console.log('Multer error:', err)
      return res.status(400).json({ 
        error: err.message,
        code: err.code 
      })
    } else if (err) {
      // An unknown error occurred
      console.log('Unknown error:', err)
      return res.status(500).json({ error: err.message })
    }
    // Everything went fine
    fileController.uploadFile(req, res)
  })
})



module.exports=fileRouter