const Image = require('../models/Image');
const { cloudinary } = require('../config/cloudinary');

const uploadImage = async (req, res) => {
  try {
    // For multiple files: req.files (not req.file)
    const files = req.files || [req.file];
    const imageUrls = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path);
      imageUrls.push(result.secure_url);
    }

    const { title, description, type, subtype, price, location, propertyType } = req.body;

    const image = new Image({
      title,
      imageUrls,
      description,
      type,
      subtype,
      price,
      location,
      propertyType: propertyType || 'Sale',
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

exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 }).populate('createdBy', 'username email');
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch images', error: err });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    // Allow admin to delete any image, user only their own
    if (!req.user.isAdmin && image.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await image.deleteOne();
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const updateImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    // Allow admin to update any image, user only their own
    if (!req.user.isAdmin && image.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, description, type, subtype, price, location, propertyType } = req.body;

    // Optional image update
    if (req.files && req.files.length > 0 && req.files[0].path) {
      console.log('Received file:', req.files[0]);
      const result = await cloudinary.uploader.upload(req.files[0].path);
      console.log('Cloudinary uploaded URL:', result.secure_url);
      image.imageUrls = [result.secure_url]; // Replace with new image URL
    }

    console.log('Before save, imageUrls:', image.imageUrls);
    await image.save();
    console.log('After save, imageUrls:', image.imageUrls);

    image.title = title || image.title;
    image.description = description || image.description;
    image.type = type || image.type;
    image.subtype = subtype || image.subtype;
    image.price = price || image.price;
    image.location = location || image.location;
    image.propertyType = propertyType || image.propertyType || 'Sale';

    await image.save();
    res.json({ message: 'Image updated successfully', image });
  } catch (err) {
    console.error('Error in updateImage:', err);
    res.status(500).json({ message: 'Failed to update image', error: err.message });
  }
};

exports.adminCreateImage = async (req, res) => {
  try {
    const files = req.files || [req.file];
    const imageUrls = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path);
      imageUrls.push(result.secure_url);
    }
    const { title, description, type, subtype, price, location, propertyType, createdBy } = req.body;
    if (!createdBy) return res.status(400).json({ message: 'createdBy (user id) is required' });
    const image = new Image({
      title,
      imageUrls,
      description,
      type,
      subtype,
      price,
      location,
      propertyType: propertyType || 'Sale',
      createdBy,
    });
    await image.save();
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload image (admin)', error: err.message });
  }
};


exports.uploadImage = uploadImage;
exports.updateImage = updateImage;

