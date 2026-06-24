const express = require('express');
const router = express.Router();
const userController = require('../../controllers/ac2070/userController');

// Route hiển thị Dashboard người dùng
router.get('/dashboard', userController.getDashboard);

// Route hiển thị thùng rác
router.get('/dashboard/rebin', userController.getRebin);

// Route sửa thông tin người dùng
router.get('/:id/edit', userController.getEdit);
router.post('/:id/edit', userController.postEdit);

// Route xóa mềm người dùng
router.post('/:id/delete', userController.postDelete);

// Route khôi phục
router.post('/:id/restore', userController.postRestore);

// Route xóa vĩnh viễn
router.post('/:id/force-delete', userController.postForceDelete);

module.exports = router;
