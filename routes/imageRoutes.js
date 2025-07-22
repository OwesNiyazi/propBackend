const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage, getImages, deleteImage, updateImage ,getAllImages, adminCreateImage } = require('../controllers/imageController');
const protect = require('../middleware/authMiddleware');
const { storage } = require('../config/cloudinary');
const isAdmin = require('../middleware/adminMiddleware');

const upload = multer({ storage });
router.get('/all', getAllImages);
router.post('/upload', protect, upload.array('image', 10), uploadImage);
router.post('/admin/upload', protect, isAdmin, upload.array('image', 10), adminCreateImage);
router.get('/', protect, getImages);
router.get('/:id', protect, async (req, res) => {
  try {
    const image = await require('../models/Image').findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.json(image);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch image', error: err.message });
  }
});
router.delete('/:id', protect, deleteImage);
//router.put('/:id', protect, updateImage);
// ✅ Apply multer to PUT route too
router.put('/:id', protect, upload.any(), updateImage);


module.exports = router;