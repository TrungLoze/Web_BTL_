const pool = require('../../config/db');

const Course = {
    // Lấy tất cả các khóa học (không bao gồm những khóa đã bị xóa mềm - deleted_at IS NOT NULL)
    async getAll() {
        const query = 'SELECT * FROM courses WHERE deleted_at IS NULL ORDER BY created_at DESC';
        const [rows] = await pool.execute(query);
        return rows;
    },

    // Lấy thông tin một khóa học cụ thể theo ID
    async getById(id) {
        const query = 'SELECT * FROM courses WHERE id = ? AND deleted_at IS NULL';
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    },

    // Lấy thông tin khóa học theo slug (VD: /courses/kahoot)
    async getBySlug(slug) {
        const query = 'SELECT * FROM courses WHERE slug = ? AND deleted_at IS NULL';
        const [rows] = await pool.execute(query, [slug]);
        return rows[0];
    },

    // Thêm khóa học mới
    async create(courseData) {
        const { title, slug, description, cover_image } = courseData;
        const query = `
            INSERT INTO courses (title, slug, description, cover_image) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [title, slug, description, cover_image]);
        return result.insertId;
    },

    // Cập nhật thông tin khóa học
    async update(slug, courseData) {
        const { title, description, cover_image } = courseData;
        const query = `
            UPDATE courses 
            SET title = ?, description = ?, cover_image = ?, updated_at = NOW() 
            WHERE slug = ? AND deleted_at IS NULL
        `;
        const [result] = await pool.execute(query, [title, description, cover_image, slug]);
        return result.affectedRows;
    },

    // Xóa mềm khóa học (Soft delete)
    async delete(slug) {
        const query = `
            UPDATE courses 
            SET deleted_at = NOW() 
            WHERE slug = ? AND deleted_at IS NULL
        `;
        const [result] = await pool.execute(query, [slug]);
        return result.affectedRows;
    },

    // Lấy tất cả khóa học trong thùng rác
    async getDeleted() {
        const query = 'SELECT * FROM courses WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC';
        const [rows] = await pool.execute(query);
        return rows;
    },

    // Khôi phục khóa học
    async restore(slug) {
        const query = 'UPDATE courses SET deleted_at = NULL WHERE slug = ?';
        const [result] = await pool.execute(query, [slug]);
        return result.affectedRows;
    },

    // Xóa vĩnh viễn khóa học
    async forceDelete(slug) {
        const query = 'DELETE FROM courses WHERE slug = ?';
        const [result] = await pool.execute(query, [slug]);
        return result.affectedRows;
    }
};

module.exports = Course;
