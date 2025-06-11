const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use a temporary folder for uploads
    const tempPath = path.join(__dirname, '../uploads/temp_files');
    fs.mkdirSync(tempPath, { recursive: true });
    cb(null, tempPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Configure multer
const upload = multer({ storage }).fields([
  { name: "html", maxCount: 1 },
  { name: "css", maxCount: 1 },
  { name: "js", maxCount: 1 },
  { name: "icon", maxCount: 1 }
]);

// Middleware to handle file uploads
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

module.exports = { uploadMiddleware };