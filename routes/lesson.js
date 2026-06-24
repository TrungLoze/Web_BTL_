const express = require('express');
const router = express.Router({ mergeParams: true });
const lessonController = require('../controllers/lessonController');

// Route hiển thị Dashboard bài học
router.get('/dashboard', lessonController.getDashboard);

// Route tạo bài học
router.get('/create', lessonController.getCreateLesson);
router.post('/create', lessonController.postCreateLesson);

// Route sửa bài học
router.get('/:id/edit', lessonController.getEditLesson);
router.post('/:id/edit', lessonController.postEditLesson);

// Route xóa mềm bài học
router.post('/:id/delete', lessonController.postDeleteLesson);

// Route hiển thị thùng rác
router.get('/dashboard/rebin', lessonController.getRebin);

// Route khôi phục bài học
router.post('/:id/restore', lessonController.postRestoreLesson);

// Route xóa vĩnh viễn bài học
router.post('/:id/force-delete', lessonController.postForceDeleteLesson);

module.exports = router;
