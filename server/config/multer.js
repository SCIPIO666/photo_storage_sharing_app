const { Router } = require('express')
const path = require('path'); 
const fileRouter = Router()
const multer = require('multer')

// Optional: Configure storage (for better control)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// File filter function
const fileFilter = (req, file, cb) => {
  // Allow only images
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'), false)
  }
}

// Configure multer with all options
const upload = multer({ 
  storage: storage, // Use custom storage (optional)
  dest: 'uploads/', // Fallback if not using storage
  fileFilter: fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // 5MB
    files: 5, // Max 5 files
    fieldSize: 2 * 1024 * 1024, // 4MB for form fields
    fieldNameSize: 100,
    fields: 10,
    parts: 20, 
    headerPairs: 2000
  }
})


module.exports = upload