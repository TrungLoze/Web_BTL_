const mysql = require('mysql2');

// Tạo một pool kết nối (Connection Pool)
// Khác với việc tạo một kết nối (connection) duy nhất, pool cho phép mở nhiều kết nối cùng lúc
// và tái sử dụng chúng, giúp trang web của bạn xử lý nhanh hơn khi có nhiều người truy cập.
const pool = mysql.createPool({
    host: 'localhost',       // Địa chỉ máy chủ CSDL (thường là máy của bạn - localhost)
    user: 'root',            // Tên tài khoản MySQL mặc định
    password: 'Trung26092006',            // Điền mật khẩu MySQL của bạn vào đây
    database: 'btl_web_db',// Điền tên cơ sở dữ liệu bạn đã tạo (từ file database.sql)
    waitForConnections: true,
    connectionLimit: 10,     // Cho phép tối đa 10 kết nối cùng lúc
    queueLimit: 0
});

// Chuyển đổi pool sang dạng hỗ trợ Promise. 
// Việc này cho phép chúng ta sử dụng cú pháp async/await (hiện đại và dễ hiểu hơn) khi gọi database.
const promisePool = pool.promise();

// Kiểm tra kết nối thử xem có thành công không
promisePool.getConnection()
    .then(connection => {
        console.log('✅ Kết nối đến MySQL thành công!');
        connection.release(); // Nhả kết nối về lại pool
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối MySQL:', err.message);
    });

// Xuất promisePool ra để các file khác trong thư mục models có thể sử dụng
module.exports = promisePool;
