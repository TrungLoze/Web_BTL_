const express = require('express');
const router = express.Router();
const authController = require('../../controllers/ac2070/authController');

// Route hiển thị trang đăng nhập và xử lý khi submit
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Route hiển thị trang đăng ký và xử lý khi submit
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Route đăng xuất
router.get('/logout', authController.logout);

module.exports = router;
