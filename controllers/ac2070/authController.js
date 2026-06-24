const User = require('../../models/ac2070/User');
const bcrypt = require('bcryptjs');

const authController = {
    // Hiển thị trang đăng nhập
    async getLogin(req, res) {
        res.render('ac2070/auth/login', { error: null });
    },

    // Xử lý dữ liệu khi người dùng bấm nút Đăng nhập
    async postLogin(req, res) {
        const { email, password } = req.body;

        try {
            // 1. Tìm xem email này có tồn tại trong CSDL không
            const user = await User.findByEmail(email);
            if (!user) {
                return res.render('ac2070/auth/login', { error: 'Email hoặc mật khẩu không đúng!' });
            }

            // 2. So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong CSDL
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render('ac2070/auth/login', { error: 'Email hoặc mật khẩu không đúng!' });
            }

            // 3. Nếu đúng hết, lưu thông tin vào Session và chuyển hướng về Trang chủ
            req.session.user = {
                id: user.id,
                full_name: user.full_name,
                role: user.role
            };
            res.redirect('/ac2070');
        } catch (error) {
            console.error(error);
            res.render('ac2070/auth/login', { error: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        }
    },

    // Hiển thị trang đăng ký
    async getRegister(req, res) {
        res.render('ac2070/auth/register', { error: null });
    },

    // Xử lý dữ liệu khi người dùng bấm nút Đăng ký
    async postRegister(req, res) {
        const { full_name, email, password, confirm_password } = req.body;

        try {
            // 1. Kiểm tra mật khẩu nhập lại có khớp không
            if (password !== confirm_password) {
                return res.render('ac2070/auth/register', { error: 'Mật khẩu nhập lại không khớp!' });
            }

            // 2. Kiểm tra xem email đã có ai dùng chưa
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.render('ac2070/auth/register', { error: 'Email này đã được sử dụng!' });
            }

            // 3. Mã hóa mật khẩu (băm mật khẩu)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 4. Lưu vào CSDL
            await User.create({
                full_name,
                email,
                password: hashedPassword
            });

            // 5. Chuyển hướng sang trang đăng nhập
            res.redirect('/ac2070/auth/login');
        } catch (error) {
            console.error(error);
            res.render('ac2070/auth/register', { error: 'Có lỗi xảy ra trong quá trình đăng ký.' });
        }
    },

    // Đăng xuất
    async logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/ac2070'); // Xóa session xong thì quay về trang chủ
        });
    }
};

module.exports = authController;
