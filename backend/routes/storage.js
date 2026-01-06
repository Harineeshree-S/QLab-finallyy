const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const fs = require('fs');
const path = require('path');
let cloudinary;
try { cloudinary = require('cloudinary').v2; } catch (e) { cloudinary = null; }

// Configure Cloudinary if env vars available
if (cloudinary && (process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET))) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    url: process.env.CLOUDINARY_URL
  });
}

// memory storage to stream to Cloudinary
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const folder = req.body.folder || process.env.CLOUDINARY_UPLOAD_FOLDER || undefined;

    // If Cloudinary configured, upload via stream
    if (cloudinary && cloudinary.config().api_key) {
      const opts = { folder, resource_type: 'auto' };
      const uploadStream = cloudinary.uploader.upload_stream(opts, (error, result) => {
        if (error) {
          console.error('Cloudinary upload error', error);
          return res.status(500).json({ error: 'Cloudinary upload failed' });
        }
        return res.json({ success: true, url: result.secure_url, public_id: result.public_id, raw: result });
      });
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      return;
    }

    // Fallback: save to local uploads folder
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const name = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    const filePath = path.join(uploadsDir, name);
    fs.writeFileSync(filePath, req.file.buffer);

    const url = `${req.protocol}://${req.get('host')}/uploads/${name}`;
    return res.json({ success: true, url, local: true });
  } catch (err) {
    console.error('Upload error', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;