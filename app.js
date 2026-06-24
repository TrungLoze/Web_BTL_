require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;

// Routers

const ed2030GioiThieuRouter = require('./routes/ed2030/gioi_thieu');
const ed2030XemVideoRouter = require('./routes/ed2030/xem_video');
const ed2030Man1Router = require('./routes/ed2030/man_1');
const ed2030Man2Router = require('./routes/ed2030/man_2');
const ed2030Man3Router = require('./routes/ed2030/man_3');
const ed2030KetQuaRouter = require('./routes/ed2030/ket_qua');
const apiRouter = require('./routes/api');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => {
    res.render('index');
});

// Mount modular routers
app.use('/api', apiRouter);

// Redirect /ed2030 to the first lesson
app.get('/ed2030', (req, res) => {
    res.redirect('/ed2030/gioi_thieu');
});

app.use('/ed2030/gioi_thieu', ed2030GioiThieuRouter);
app.use('/ed2030/xem_video', ed2030XemVideoRouter);
app.use('/ed2030/man_1', ed2030Man1Router);
app.use('/ed2030/man_2', ed2030Man2Router);
app.use('/ed2030/man_3', ed2030Man3Router);
app.use('/ed2030/ket_qua', ed2030KetQuaRouter);

app.listen(port, () => {
    console.log(`Working at http://localhost:${port}`);
});
