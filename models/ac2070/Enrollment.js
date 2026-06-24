const pool = require('../../config/db');

const Enrollment = {
    // Kiểm tra xem người dùng đã đăng ký khóa học này chưa
    async checkEnrollment(userId, courseId) {
        const query = 'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?';
        const [rows] = await pool.execute(query, [userId, courseId]);
        return rows.length > 0 ? rows[0] : null;
    },

    // Lưu thông tin đăng ký khóa học của người dùng vào CSDL
    async enroll(userId, courseId) {
        const query = 'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)';
        const [result] = await pool.execute(query, [userId, courseId]);
        return result.insertId;
    },

    // Lấy số lượng bài học mà người dùng đã hoàn thành trong một khóa học cụ thể
    async getCompletedLessonsCount(userId, courseId) {
        const query = `
            SELECT COUNT(*) as count 
            FROM lesson_completions lc
            JOIN lessons l ON lc.lesson_id = l.id
            WHERE lc.user_id = ? AND l.course_id = ?
        `;
        const [rows] = await pool.execute(query, [userId, courseId]);
        return rows[0].count;
    },

    // Lấy danh sách ID các bài học đã hoàn thành
    async getCompletedLessonIds(userId, courseId) {
        const query = `
            SELECT lc.lesson_id 
            FROM lesson_completions lc
            JOIN lessons l ON lc.lesson_id = l.id
            WHERE lc.user_id = ? AND l.course_id = ?
        `;
        const [rows] = await pool.execute(query, [userId, courseId]);
        return rows.map(row => row.lesson_id);
    },

    // Đánh dấu bài học đã hoàn thành
    async markLessonCompleted(userId, lessonId) {
        // Kiểm tra xem đã hoàn thành chưa để tránh trùng lặp
        const checkQuery = 'SELECT * FROM lesson_completions WHERE user_id = ? AND lesson_id = ?';
        const [existing] = await pool.execute(checkQuery, [userId, lessonId]);
        if (existing.length === 0) {
            const query = 'INSERT INTO lesson_completions (user_id, lesson_id) VALUES (?, ?)';
            const [result] = await pool.execute(query, [userId, lessonId]);
            return result.insertId;
        }
        return null;
    },

    // Lấy danh sách các khóa học mà người dùng đã đăng ký kèm theo tiến độ
    async getUserEnrollments(userId) {
        const query = `
            SELECT 
                c.id, c.title, c.slug, c.cover_image, c.description,
                e.enrolled_at,
                (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id AND l.deleted_at IS NULL) as total_lessons,
                (SELECT COUNT(*) FROM lesson_completions lc 
                 JOIN lessons l2 ON lc.lesson_id = l2.id 
                 WHERE lc.user_id = ? AND l2.course_id = c.id AND l2.deleted_at IS NULL) as completed_lessons
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = ? AND c.deleted_at IS NULL
            ORDER BY e.enrolled_at DESC
        `;
        const [rows] = await pool.execute(query, [userId, userId]);
        return rows;
    },

    // Lấy danh sách người dùng đã đăng ký một khóa học cụ thể kèm theo tiến độ
    async getCourseEnrollments(courseId) {
        const query = `
            SELECT 
                u.id, u.full_name, u.email,
                e.enrolled_at,
                (SELECT COUNT(*) FROM lessons l WHERE l.course_id = e.course_id AND l.deleted_at IS NULL) as total_lessons,
                (SELECT COUNT(*) FROM lesson_completions lc 
                 JOIN lessons l2 ON lc.lesson_id = l2.id 
                 WHERE lc.user_id = u.id AND l2.course_id = e.course_id AND l2.deleted_at IS NULL) as completed_lessons
            FROM enrollments e
            JOIN users u ON e.user_id = u.id
            WHERE e.course_id = ? AND u.deleted_at IS NULL
            ORDER BY e.enrolled_at DESC
        `;
        const [rows] = await pool.execute(query, [courseId]);
        return rows;
    }
};

module.exports = Enrollment;
