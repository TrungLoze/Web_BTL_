const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const fs = require('fs');
const path = require('path');




const courseController = {
    // Hiển thị danh sách khóa học nổi bật
    async getCourseList(req, res) {
        try {
            const courses = await Course.getAll();

            res.render('courses/course_list', {
                courses: courses
            });
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070');
        }
    },

    
    // Hiển thị Dashboard quản lý khóa học (Admin)
    async getDashboard(req, res) {
        try {
            const courses = await Course.getAll();
            
            res.render('courses/course_dashboard', { courses });
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070');
        }
    },

    // Hiển thị chi tiết khóa học dựa vào slug
    async getCourseDetail(req, res) {
        try {
            const slug = req.params.slug;
            const course = await Course.getBySlug(slug);

            if (!course) {
                // Nếu không tìm thấy khóa học, chuyển về trang chủ (hoặc có thể làm trang 404)
                return res.redirect('/ac2070');
            }

            let lessons = await Lesson.getAllByCourseId(course.id);
            
            // Xử lý link video để lấy dạng embed cho iframe
            lessons = lessons.map(lesson => {
                let embedUrl = lesson.video_url;
                if (embedUrl.includes('youtube.com/watch?v=')) {
                    embedUrl = embedUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/');
                    embedUrl = embedUrl.split('&')[0]; // bỏ các tham số phụ phía sau
                } else if (embedUrl.includes('youtu.be/')) {
                    embedUrl = embedUrl.replace('youtu.be/', 'youtube.com/embed/');
                    embedUrl = embedUrl.split('?')[0];
                }
                lesson.embed_url = embedUrl;
                return lesson;
            });

            // Xử lý kiểm tra người dùng đã đăng ký khóa học chưa
            let isEnrolled = false;
            let completedLessonsCount = 0;
            let progressPercent = 0;
            let completedLessonIds = [];
            if (req.session.user) {
                const enrollment = await Enrollment.checkEnrollment(req.session.user.id, course.id);
                if (enrollment) {
                    isEnrolled = true;
                    completedLessonsCount = await Enrollment.getCompletedLessonsCount(req.session.user.id, course.id);
                    progressPercent = lessons.length > 0 ? Math.round((completedLessonsCount / lessons.length) * 100) : 0;
                    completedLessonIds = await Enrollment.getCompletedLessonIds(req.session.user.id, course.id);
                }
            }

            res.render('courses/course_detail', { 
                course: course,
                lessons: lessons,
                user: req.session.user || null,
                isEnrolled: isEnrolled,
                completedLessonsCount: completedLessonsCount,
                progressPercent: progressPercent,
                completedLessonIds: completedLessonIds
            });
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070');
        }
    },

    // Hiển thị form tạo khóa học (chỉ dành cho Admin)
    getCreateCourse(req, res) {
        res.render('courses/course_create', { error: null });
    },

    // Xử lý tạo khóa học mới
    async postCreateCourse(req, res) {
        try {
            const { title, description, cover_image } = req.body;
            
            // Hàm chuyển đổi Tiếng Việt có dấu thành không dấu và tạo slug
            const generateSlug = (str) => {
                return str.toLowerCase()
                    .normalize('NFD') // Tách dấu ra khỏi ký tự
                    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
                    .replace(/đ/g, 'd').replace(/Đ/g, 'd') // Thay thế chữ đ
                    .replace(/[^a-z0-9 ]/g, '') // Xóa ký tự đặc biệt
                    .trim()
                    .replace(/\s+/g, '-'); // Thay khoảng trắng bằng dấu gạch ngang
            };

            let slug = generateSlug(title);

            // Kiểm tra xem slug đã tồn tại chưa để tránh lỗi UNIQUE trong DB
            let existingCourse = await Course.getBySlug(slug);
            if (existingCourse) {
                // Nếu trùng, thêm một số ngẫu nhiên vào cuối
                slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
            }

            // Xử lý upload ảnh
            let finalCoverImage = cover_image || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop';
            if (req.file) {
                const ext = path.extname(req.file.originalname);
                const newFilename = `${slug}${ext}`;
                const newPath = path.join('public', 'images', newFilename);
                fs.renameSync(req.file.path, newPath);
                finalCoverImage = `/images/${newFilename}`;
            }

            await Course.create({
                title,
                slug,
                description,
                cover_image: finalCoverImage
            });

            // Chuyển hướng sang trang chi tiết khóa học vừa tạo
            res.redirect(`/ac2070/course/${slug}`);
        } catch (error) {
            console.error(error);
            res.render('courses/course_create', { error: 'Đã có lỗi xảy ra khi tạo khóa học.' });
        }
    },

    // Hiển thị form sửa khóa học
    async getEditCourse(req, res) {
        try {
            const slug = req.params.slug;
            const course = await Course.getBySlug(slug);
            
            if (!course) {
                return res.redirect('/ac2070/course/dashboard');
            }

            res.render('courses/course_edit', { course, error: null });
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070/course/dashboard');
        }
    },

    // Xử lý sửa khóa học
    async postEditCourse(req, res) {
        const slug = req.params.slug;
        try {
            const { title, description, cover_image } = req.body;
            
            // Lấy thông tin khóa học cũ để phòng hờ giữ lại ảnh cũ
            const course = await Course.getBySlug(slug);
            let finalCoverImage = cover_image || course.cover_image;

            // Xử lý nếu có file upload lên
            if (req.file) {
                const ext = path.extname(req.file.originalname);
                const newFilename = `${slug}${ext}`;
                const newPath = path.join('public', 'images', newFilename);
                fs.renameSync(req.file.path, newPath);
                finalCoverImage = `/images/${newFilename}`;
            }

            await Course.update(slug, {
                title,
                description,
                cover_image: finalCoverImage
            });

            // Sau khi cập nhật, quay về dashboard
            res.redirect('/ac2070/course/dashboard');
        } catch (error) {
            console.error(error);
            const course = await Course.getBySlug(slug);
            res.render('courses/course_edit', { course, error: 'Đã có lỗi xảy ra khi cập nhật khóa học.' });
        }
    },

    // Xử lý xóa khóa học (Soft delete)
    async postDeleteCourse(req, res) {
        try {
            const slug = req.params.slug;
            await Course.delete(slug);
            res.redirect('/ac2070/course/dashboard');
        } catch (error) {
            console.error('Lỗi khi xóa khóa học:', error);
            res.redirect('/ac2070/course/dashboard');
        }
    },

    // Hiển thị Thùng rác (Admin)
    async getRebin(req, res) {
        try {
            const courses = await Course.getDeleted();
            res.render('courses/course_rebin', { courses });
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070/course/dashboard');
        }
    },

    // Xử lý khôi phục khóa học
    async postRestoreCourse(req, res) {
        try {
            const slug = req.params.slug;
            await Course.restore(slug);
            res.redirect('/ac2070/course/dashboard/rebin');
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070/course/dashboard/rebin');
        }
    },

    // Xóa vĩnh viễn khóa học (Hard delete)
    async postForceDeleteCourse(req, res) {
        try {
            const slug = req.params.slug;
            await Course.forceDelete(slug);
            res.redirect('/ac2070/course/dashboard/rebin');
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070/course/dashboard/rebin');
        }
    },

    // Xử lý đăng ký khóa học
    async postEnrollCourse(req, res) {
        try {
            const slug = req.params.slug;
            const course = await Course.getBySlug(slug);
            if (!course) {
                return res.redirect('/ac2070');
            }
            if (!req.session.user) {
                return res.redirect('/ac2070/auth/login');
            }
            const userId = req.session.user.id;
            
            // Kiểm tra xem đã đăng ký chưa
            const existingEnrollment = await Enrollment.checkEnrollment(userId, course.id);
            if (!existingEnrollment) {
                await Enrollment.enroll(userId, course.id);
            }
            res.redirect(`/ac2070/course/${slug}`);
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070');
        }
    },

    // API: Đánh dấu hoàn thành bài học
    async postCompleteLesson(req, res) {
        try {
            if (!req.session.user) {
                return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập' });
            }
            const lessonId = req.params.lessonId;
            const userId = req.session.user.id;
            await Enrollment.markLessonCompleted(userId, lessonId);
            res.json({ success: true });
        } catch (error) {
            console.error('Lỗi khi hoàn thành bài học:', error);
            res.status(500).json({ success: false });
        }
    }
};

module.exports = courseController;
