const pool = require('../../config/db');

const Lesson = {
    // Lấy tất cả bài học của một khóa học (không bao gồm xóa mềm), sắp xếp theo thứ tự bài học
    async getAllByCourseId(courseId) {
        const query = 'SELECT * FROM lessons WHERE course_id = ? AND deleted_at IS NULL ORDER BY lesson_order ASC';
        const [rows] = await pool.execute(query, [courseId]);
        return rows;
    },

    // Lấy số thứ tự lớn nhất hiện tại
    async getMaxOrder(courseId) {
        const query = 'SELECT MAX(lesson_order) as maxOrder FROM lessons WHERE course_id = ? AND deleted_at IS NULL';
        const [rows] = await pool.execute(query, [courseId]);
        return rows[0].maxOrder || 0;
    },

    // Thêm bài học mới và tự động dịch chuyển thứ tự các bài khác nếu cần
    async create(lessonData) {
        const { course_id, lesson_order, title, video_url, duration } = lessonData;

        // Cần dịch chuyển các bài học khác nếu chèn vào giữa
        const shiftQuery = 'UPDATE lessons SET lesson_order = lesson_order + 1 WHERE course_id = ? AND lesson_order >= ? AND deleted_at IS NULL';
        await pool.execute(shiftQuery, [course_id, lesson_order]);

        const query = `
            INSERT INTO lessons (course_id, lesson_order, title, video_url, duration) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [course_id, lesson_order, title, video_url, duration]);
        return result.insertId;
    },

    // Lấy thông tin một bài học cụ thể
    async getById(id) {
        const query = 'SELECT * FROM lessons WHERE id = ? AND deleted_at IS NULL';
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    },

    // Cập nhật thông tin bài học
    async update(id, lessonData) {
        const { title, video_url, duration, lesson_order } = lessonData;
        const query = `
            UPDATE lessons 
            SET title = ?, video_url = ?, duration = ?, lesson_order = ?, updated_at = NOW() 
            WHERE id = ? AND deleted_at IS NULL
        `;
        const [result] = await pool.execute(query, [title, video_url, duration, lesson_order, id]);
        return result.affectedRows;
    },

    // Xóa mềm bài học (Soft delete)
    async delete(id) {
        const query = `
            UPDATE lessons 
            SET deleted_at = NOW() 
            WHERE id = ? AND deleted_at IS NULL
        `;
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    },

    // Lấy tất cả bài học trong thùng rác của một khóa học
    async getDeletedByCourseId(courseId) {
        const query = 'SELECT * FROM lessons WHERE course_id = ? AND deleted_at IS NOT NULL ORDER BY deleted_at DESC';
        const [rows] = await pool.execute(query, [courseId]);
        return rows;
    },

    // Khôi phục bài học
    async restore(id) {
        const query = 'UPDATE lessons SET deleted_at = NULL WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    },

    // Xóa vĩnh viễn bài học
    async forceDelete(id) {
        const query = 'DELETE FROM lessons WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    }
};

module.exports = Lesson;
