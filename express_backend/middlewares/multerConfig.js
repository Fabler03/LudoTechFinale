const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configura lo storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Usa una cartella temporanea per i caricamenti
    const tempPath = path.join(__dirname, '../uploads/temp_files');
    fs.mkdirSync(tempPath, { recursive: true });
    cb(null, tempPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Configura multer per gestire i file caricati
const upload = multer({ storage }).fields([
  { name: "html", maxCount: 1 },
  { name: "css", maxCount: 1 },
  { name: "js", maxCount: 1 },
  { name: "icon", maxCount: 1 }
]);

// Middleware to gestire i file caricati
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