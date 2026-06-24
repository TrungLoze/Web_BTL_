const Course = require('../../models/ac2070/Course');
const Lesson = require('../../models/ac2070/Lesson');
const https = require('https');

function getYoutubeDuration(videoUrl) {
    return new Promise((resolve) => {
        https.get(videoUrl, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const match = data.match(/"lengthSeconds":"(\d+)"/);
                if (match && match[1]) {
                    const totalSeconds = parseInt(match[1], 10);
                    const minutes = Math.floor(totalSeconds / 60);
                    const seconds = totalSeconds % 60;
                    resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
                } else {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

const lessonController = {
    async getDashboard(req, res) {
        try {
            const slug = req.params.slug;
            const course = await Course.getBySlug(slug);
            
            if (!course) {
                return res.redirect('/ac2070/course/dashboard');
            }

            const lessons = await Lesson.getAllByCourseId(course.id);
            
            res.render('ac2070/lessons/lesson_dashboard', {
                course,
                lessons,
                user: req.session.user || null
            });
        } catch (error) {
            console.error('Lỗi khi lấy dashboard bài học:', error);
            res.redirect('/ac2070/course/dashboard');
        }
    },

    async getCreateLesson(req, res) {
        try {
            const slug = req.params.slug;
            const course = await Course.getBySlug(slug);
            if (!course) return res.redirect('/ac2070/course/dashboard');

            const lessons = await Lesson.getAllByCourseId(course.id);
            const maxOrder = await Lesson.getMaxOrder(course.id);

            res.render('ac2070/lessons/lesson_create', { course, lessons, maxOrder, error: null, user: req.session.user });
        } catch (error) {
            console.error(error);
            res.redirect(`/ac2070/course/${req.params.slug}/lessons/dashboard`);
        }
    },

    async postCreateLesson(req, res) {
        const slug = req.params.slug;
        try {
            let { title, video_url, duration, lesson_order } = req.body;
            const course = await Course.getBySlug(slug);
            if (!course) return res.redirect('/ac2070/course/dashboard');

            if (!duration && (video_url.includes('youtube.com') || video_url.includes('youtu.be'))) {
                const fetchedDuration = await getYoutubeDuration(video_url);
                if (fetchedDuration) {
                    duration = fetchedDuration;
                }
            }

            await Lesson.create({
                course_id: course.id,
                lesson_order: parseInt(lesson_order),
                title,
                video_url,
                duration
            });

            res.redirect(`/ac2070/course/${slug}/lessons/dashboard`);
        } catch (error) {
            console.error(error);
            const course = await Course.getBySlug(slug);
            const lessons = await Lesson.getAllByCourseId(course.id);
            const maxOrder = await Lesson.getMaxOrder(course.id);
            res.render('ac2070/lessons/lesson_create', { course, lessons, maxOrder, error: 'Đã có lỗi xảy ra', user: req.session.user });
        }
    },

    async getEditLesson(req, res) {
        try {
            const slug = req.params.slug;
            const id = req.params.id;
            
            const course = await Course.getBySlug(slug);
            if (!course) return res.redirect('/ac2070/course/dashboard');

            const lesson = await Lesson.getById(id);
            if (!lesson) return res.redirect(`/ac2070/course/${slug}/lessons/dashboard`);

            const lessons = await Lesson.getAllByCourseId(course.id);
            
            res.render('ac2070/lessons/lesson_edit', { course, lesson, lessons, error: null, user: req.session.user });
        } catch (error) {
            console.error(error);
            res.redirect(`/ac2070/course/${req.params.slug}/lessons/dashboard`);
        }
    },

    async postEditLesson(req, res) {
        const slug = req.params.slug;
        const id = req.params.id;
        try {
            let { title, video_url, duration, lesson_order } = req.body;
            const course = await Course.getBySlug(slug);
            if (!course) return res.redirect('/ac2070/course/dashboard');

            // Tự động lấy thời lượng nếu link Youtube và thời lượng trống
            if (!duration && (video_url.includes('youtube.com') || video_url.includes('youtu.be'))) {
                const fetchedDuration = await getYoutubeDuration(video_url);
                if (fetchedDuration) {
                    duration = fetchedDuration;
                }
            }

            await Lesson.update(id, {
                title,
                video_url,
                duration,
                lesson_order: parseInt(lesson_order)
            });

            res.redirect(`/ac2070/course/${slug}/lessons/dashboard`);
        } catch (error) {
            console.error(error);
            const course = await Course.getBySlug(slug);
            const lesson = await Lesson.getById(id);
            const lessons = await Lesson.getAllByCourseId(course.id);
            res.render('ac2070/lessons/lesson_edit', { course, lesson, lessons, error: 'Đã có lỗi xảy ra', user: req.session.user });
        }
    },

    // Xóa mềm bài học
    async postDeleteLesson(req, res) {
        try {
            const id = req.params.id;
            const slug = req.params.slug;
            await Lesson.delete(id);
            res.redirect(`/ac2070/course/${slug}/lessons/dashboard`);
        } catch (error) {
            console.error('Lỗi khi xóa bài học:', error);
            res.redirect(`/ac2070/course/${req.params.slug}/lessons/dashboard`);
        }
    },

    // Hiển thị thùng rác bài học
    async getRebin(req, res) {
        try {
            const slug = req.params.slug;
            const course = await Course.getBySlug(slug);
            if (!course) return res.redirect('/ac2070/course/dashboard');

            const lessons = await Lesson.getDeletedByCourseId(course.id);
            res.render('ac2070/lessons/lesson_rebin', { course, lessons, user: req.session.user });
        } catch (error) {
            console.error(error);
            res.redirect(`/ac2070/course/${req.params.slug}/lessons/dashboard`);
        }
    },

    // Khôi phục bài học
    async postRestoreLesson(req, res) {
        try {
            const id = req.params.id;
            const slug = req.params.slug;
            await Lesson.restore(id);
            res.redirect(`/ac2070/course/${slug}/lessons/dashboard/rebin`);
        } catch (error) {
            console.error(error);
            res.redirect(`/ac2070/course/${req.params.slug}/lessons/dashboard/rebin`);
        }
    },

    // Xóa vĩnh viễn bài học
    async postForceDeleteLesson(req, res) {
        try {
            const id = req.params.id;
            const slug = req.params.slug;
            await Lesson.forceDelete(id);
            res.redirect(`/ac2070/course/${slug}/lessons/dashboard/rebin`);
        } catch (error) {
            console.error(error);
            res.redirect(`/ac2070/course/${req.params.slug}/lessons/dashboard/rebin`);
        }
    }
};

module.exports = lessonController;
