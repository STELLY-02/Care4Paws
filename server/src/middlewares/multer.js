const multer = require('multer');

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null,  file.originalname);
    }  
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // Limit file size to 10MB
  });

module.exports = upload;