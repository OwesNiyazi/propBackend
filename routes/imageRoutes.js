const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage, getImages, deleteImage, updateImage } = require('../controllers/imageController');
const protect = require('../middleware/authMiddleware');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

router.post('/upload', protect, upload.single('image'), uploadImage);
router.get('/', protect, getImages);
router.delete('/:id', protect, deleteImage);
//router.put('/:id', protect, updateImage);
// ✅ Apply multer to PUT route too
router.put('/:id', protect, upload.single('image'), updateImage);


module.exports = router;
