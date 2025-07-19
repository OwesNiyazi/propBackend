const Image = require('../models/Image');
const { cloudinary } = require('../config/cloudinary');

exports.uploadImage = async (req, res) => {
  try {
    const image = await Image.create({
      title: req.body.title,
      imageUrl: req.file.path,
      publicId: req.file.filename,
      user: req.user.id
    });
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err });
  }
};

exports.getImages = async (req, res) => {
  try {
    const images = await Image.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch images', error: err });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    if (image.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    image.title = req.body.title || image.title;
    await image.save();

    res.status(200).json(image);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update image', error: err });
  }
};
