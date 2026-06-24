const pool = require('../config/db');

const User = {
    // Tìm người dùng theo Email (dùng khi đăng nhập hoặc kiểm tra trùng lặp khi đăng ký)
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL';
        const [rows] = await pool.execute(query, [email]);
        return rows[0]; // Trả về người dùng đầu tiên tìm thấy (nếu có)
    },

    // Tìm người dùng theo ID (dùng để lưu vào session)
    async findById(id) {
        const query = 'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL';
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    },

    // Tạo tài khoản mới (dùng khi đăng ký)
    async create(userData) {
        const { full_name, email, password } = userData;
        const query = 'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)';
        const [result] = await pool.execute(query, [full_name, email, password]);
        return result.insertId; // Trả về ID của người dùng vừa được tạo
    },

    // Lấy tất cả người dùng (chưa bị xóa)
    async getAll() {
        const query = 'SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC';
        const [rows] = await pool.execute(query);
        return rows;
    },

    // Đổi quyền người dùng
    async updateRole(id, role) {
        const query = 'UPDATE users SET role = ? WHERE id = ? AND deleted_at IS NULL';
        const [result] = await pool.execute(query, [role, id]);
        return result.affectedRows;
    },

    // Cập nhật thông tin (ví dụ Tên)
    async update(id, fullName) {
        const query = 'UPDATE users SET full_name = ? WHERE id = ? AND deleted_at IS NULL';
        const [result] = await pool.execute(query, [fullName, id]);
        return result.affectedRows;
    },

    // Đổi mật khẩu
    async updatePassword(id, hashedPassword) {
        const query = 'UPDATE users SET password = ? WHERE id = ? AND deleted_at IS NULL';
        const [result] = await pool.execute(query, [hashedPassword, id]);
        return result.affectedRows;
    },

    // Xóa mềm
    async delete(id) {
        const query = 'UPDATE users SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL';
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    },

    // Thùng rác
    async getDeleted() {
        const query = 'SELECT * FROM users WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC';
        const [rows] = await pool.execute(query);
        return rows;
    },

    // Khôi phục
    async restore(id) {
        const query = 'UPDATE users SET deleted_at = NULL WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    },

    // Xóa vĩnh viễn
    async forceDelete(id) {
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows;
    }
};

module.exports = User;
