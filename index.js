const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
// admin
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const createAdminIfNotExist = async () => {
  const admin = await User.findOne({ email: 'admin@mail.com' });
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin@123', 10);
    await User.create({ username: 'admin', email: 'admin@mail.com', password: hashedPassword, isAdmin: true });
    console.log('✅ Admin user created');
  }
};
createAdminIfNotExist();
///

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/images', require('./routes/imageRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
