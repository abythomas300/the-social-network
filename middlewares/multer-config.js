// configuration for multer package
const multer = require('multer')

// custom configuration for uploaded file storage
const storageConfig = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb){
        const uniqueFileName = `${file.fieldname}-${Date.now()}-${file.originalname}`
        cb(null, uniqueFileName)
    }
})

// creating a multer instance with custom storage configuration
const upload = multer({storage:storageConfig})



// exporting the created multer instance
module.exports = upload

