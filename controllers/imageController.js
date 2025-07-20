const Image = require('../models/Image');
const { cloudinary } = require('../config/cloudinary');

const uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const { title, description, type, price, location } = req.body;

    const image = new Image({
      title,
      imageUrl: result.secure_url,
      description,
      type,
      price,
      location,
      createdBy: req.user.id,
    });

    await image.save();
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload image' });
  }
};


exports.getImages = async (req, res) => {
  try {
    // const images = await Image.find({ user: req.user.id }).sort({ createdAt: -1 });
    const images = await Image.find({ createdBy: req.user.id }).sort({ createdAt: -1 });

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


const updateImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    // Only allow update if it's the user's image
    if (image.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    const { title, description, type, price, location } = req.body;

    image.title = title || image.title;
    image.description = description || image.description;
    image.type = type || image.type;
    image.price = price || image.price;
    image.location = location || image.location;

    await image.save();
    res.json(image);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update image' });
  }
};

exports.uploadImage = uploadImage;
exports.updateImage = updateImage;

