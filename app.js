const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const diariesRouter = require('./routes/diaries');
const noticesRouter = require('./routes/notices');
const contentsRouter = require('./routes/contents');
const mainRouter = require('./routes/main');
const uploadsRouter = require('./routes/uploads');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'html');
nunjucks.configure('views', {
	express: app,
	watch: true,
});
app.set("trust proxy", 1);
app.use(cors({
	origin: "https://dnd-5th-7-frontend-eight.vercel.app",
	credentials: true
}));

app.use(bodyParser.json());
sequelize.sync({ forTce: false })
	.then(() => {
		console.log('데이터베이스 연결 성공');
	})
	.catch((err) => {
		console.error(err);
	});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
	resave: true,
	saveUninitialized: false,
	secret: process.env.COOKIE_SECRET,
	cookie: {
		httpOnly: true,
		sameSite: 'none',
		secure: true,
	},
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/diaries', diariesRouter);
app.use('/contents', contentsRouter);
app.use('/notices', noticesRouter);
app.use('/main', mainRouter);
app.use('/uploads', uploadsRouter);

app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
	error.status = 404;
	next(error);
});

app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
	res.status(err.status || 500);
	res.render('error');
});

app.listen(app.get('port'), () => {
	console.log(app.get('port'), '번 포트에서 대기중');
});

module.exports = app;