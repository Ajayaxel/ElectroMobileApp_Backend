const express = require('express');
const router = express.Router();
const { register, login, adminLogin, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);   // Admin only — rejects non-admin role
router.get('/profile', protect, getProfile);

module.exports = router;
