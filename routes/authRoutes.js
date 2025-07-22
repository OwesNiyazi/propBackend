const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, updateUserByAdmin, deleteUserByAdmin, adminCreateUser, adminUpdateUser } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/users', protect, isAdmin, getAllUsers);
router.post('/users', protect, isAdmin, adminCreateUser);
router.put('/users/:id', protect, isAdmin, adminUpdateUser);
router.delete('/users/:id', protect, isAdmin, deleteUserByAdmin);

module.exports = router;
