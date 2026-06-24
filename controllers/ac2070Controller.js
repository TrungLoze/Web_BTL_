const Course = require('../models/Course');

exports.index = async (req, res) => {
    try {
        // Lấy danh sách khóa học từ Database
        const courses = await Course.getAll();
        
        // Truyền mảng 'courses' ra file view 'ac2070.ejs'
        res.render('ac2070', { courses });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server khi lấy dữ liệu khóa học.");
    }
};
