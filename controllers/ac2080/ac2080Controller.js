exports.index = (req, res) => {
    // Biến cấu hình link game GDevelop (người dùng có thể thay đổi biến này khi cập nhật game)
    const gameUrl = 'https://gd.games/games/4789310b-97bc-4f62-8b37-076585e7d444';
    
    res.render('ac2080/index', { gameUrl });
};

