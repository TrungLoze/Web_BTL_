const User = require('../../models/ac2070/User');

const userController = {
    // Hiển thị danh sách người dùng (Dashboard)
    async getDashboard(req, res) {
        try {
            const users = await User.getAll();
            
            res.render('ac2070/users/user_dashboard', { users });
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070');
        }
    },

    // Hiển thị form chỉnh sửa người dùng
    async getEdit(req, res) {
        try {
            const id = req.params.id;
            const editUser = await User.findById(id);
            if (!editUser) {
                return res.redirect('/ac2070/users/dashboard');
            }
            res.render('ac2070/users/user_edit', { editUser, error: null });
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070/users/dashboard');
        }
    },

    // Xử lý chỉnh sửa
    async postEdit(req, res) {
        const id = req.params.id;
        try {
            const { full_name, role } = req.body;
            // Cập nhật tên
            if (full_name) {
                await User.update(id, full_name);
            }
            // Cập nhật vai trò (Nếu có quyền)
            if (role && ['student', 'admin'].includes(role)) {
                // Không cho phép Admin tự hủy quyền của chính mình (chống lỗi tự sát)
                if (req.session.user.id !== parseInt(id) || role === 'admin') {
                    await User.updateRole(id, role);
                }
            }
            res.redirect('/ac2070/users/dashboard');
        } catch (error) {
            console.error(error);
            const editUser = await User.findById(id);
            res.render('ac2070/users/user_edit', { editUser, error: 'Lỗi khi cập nhật người dùng' });
        }
    },

    // Xóa mềm người dùng
    async postDelete(req, res) {
        try {
            const id = req.params.id;
            // Không cho phép xóa chính mình
            if (req.session.user.id !== parseInt(id)) {
                await User.delete(id);
            }
            res.redirect('/ac2070/users/dashboard');
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070/users/dashboard');
        }
    },

    // Hiển thị thùng rác
    async getRebin(req, res) {
        try {
            const users = await User.getDeleted();
            res.render('ac2070/users/user_rebin', { users });
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070/users/dashboard');
        }
    },

    // Khôi phục
    async postRestore(req, res) {
        try {
            const id = req.params.id;
            await User.restore(id);
            res.redirect('/ac2070/users/dashboard/rebin');
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070/users/dashboard/rebin');
        }
    },

    // Xóa vĩnh viễn
    async postForceDelete(req, res) {
        try {
            const id = req.params.id;
            await User.forceDelete(id);
            res.redirect('/ac2070/users/dashboard/rebin');
        } catch (error) {
            console.error(error);
            res.redirect('/ac2070/users/dashboard/rebin');
        }
    }
};

module.exports = userController;
