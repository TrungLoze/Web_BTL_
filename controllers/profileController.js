const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Enrollment = require('../models/Enrollment');

const profileController = {
    // Hiển thị trang Hồ sơ của tôi
    async getProfile(req, res) {
        try {
            const userId = req.session.user.id;
            const userProfile = await User.findById(userId);
            if (!userProfile) {
                return res.redirect('/ac2070');
            }
            res.render('users/profile', { 
                userProfile, 
                success: req.query.success || null,
                error: req.query.error || null 
            });
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070');
        }
    },

    // Xử lý cập nhật thông tin (Tên)
    async postUpdateProfile(req, res) {
        try {
            const userId = req.session.user.id;
            const { full_name } = req.body;

            if (full_name && full_name.trim() !== '') {
                await User.update(userId, full_name.trim());
                // Cập nhật lại session
                req.session.user.full_name = full_name.trim();
                return res.redirect('/ac2070/profile?success=update_info');
            }
            res.redirect('/ac2070/profile?error=empty_name');
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070/profile?error=update_failed');
        }
    },

    // Xử lý đổi mật khẩu
    async postChangePassword(req, res) {
        try {
            const userId = req.session.user.id;
            const { current_password, new_password, confirm_password } = req.body;

            // 1. Kiểm tra mật khẩu mới và nhập lại có khớp không
            if (new_password !== confirm_password) {
                return res.redirect('/ac2070/profile?error=password_mismatch');
            }

            // 2. Lấy thông tin user từ DB để lấy mật khẩu cũ đã mã hóa
            const user = await User.findById(userId);
            if (!user) return res.redirect('/ac2070');

            // 3. So sánh mật khẩu hiện tại người dùng nhập với DB
            const isMatch = await bcrypt.compare(current_password, user.password);
            if (!isMatch) {
                return res.redirect('/ac2070/profile?error=wrong_password');
            }

            // 4. Mã hóa mật khẩu mới và lưu
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(new_password, salt);
            await User.updatePassword(userId, hashedPassword);

            res.redirect('/ac2070/profile?success=change_password');
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070/profile?error=change_password_failed');
        }
    },

    // Hiển thị Khóa học của tôi
    async getMyCourses(req, res) {
        try {
            const userId = req.session.user.id;
            const myCourses = await Enrollment.getUserEnrollments(userId);
            res.render('users/my_courses', {
                myCourses,
                user: req.session.user
            });
        } catch (error) {
            console.error('Lỗi khi tải khóa học của tôi:', error);
            res.redirect('/ac2070/profile');
        }
    }
};

module.exports = profileController;
