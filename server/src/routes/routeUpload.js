const express = require('express');
const router = express.Router();
const cloudinary = require('../utils/cloudinary');
const upload = require('../middlewares/multer');

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const result = await cloudinary.uploader.upload(req.file.path);
    res.status(200).json({
      success: true,
      message: "Uploaded!",
      data: result.secure_url
    });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({
      success: false,
      message: "Error uploading image"
    });
  }
});

module.exports = router;