const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Admin access only' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error checking admin access' });
  }
};

module.exports = isAdmin;
