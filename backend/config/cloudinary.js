// ⭐️ NEW: This entire file is new.
// Create this file in a 'config' folder in your project's root.

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your .env credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer with improved options
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'orderly_uploads',
    allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    timeout: 120000, // 2 minutes timeout
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `item-${uniqueSuffix}`;
    },
  },
});

// Initialize Multer with the Cloudinary storage
const upload = multer({ storage: storage });

module.exports = upload;