const express = require('express');
const authController = require('../controller/auth.controller');
const validate = require('../middleware/validate.middleware');
const { register, login, forgotPassword, resetPassword, changePassword, updateProfile } = require('../validation/auth.validation');
const { isAuth } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.post('/register', validate(register), authController.register);
router.post('/login', validate(login), authController.login);
router.post('/logout', isAuth, authController.logout);
router.post('/forgot-password', validate(forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(resetPassword), authController.resetPassword);
router.post('/change-password', isAuth, validate(changePassword), authController.changePassword);
router.get('/verify-email', authController.verifyEmail);

// Profile and token management
router.get('/profile', isAuth, authController.getProfile);
router.put('/profile', isAuth, validate(updateProfile), authController.updateProfile);
router.patch('/profile', isAuth, validate(updateProfile), authController.updateProfile);
router.post('/avatar', isAuth, authController.uploadAvatarBase64);
router.post('/refresh', authController.refresh);

router.post('/upload-profile', isAuth, upload.single('profileImage'), authController.uploadProfile);

module.exports = router;
