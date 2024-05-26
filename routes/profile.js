const express = require('express');
const { getProfile, updateProfile, requestPasswordReset, resetPassword } = require('../controllers/profileController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, updateProfile);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;