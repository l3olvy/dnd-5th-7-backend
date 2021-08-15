var express = require('express');
var router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/', function (req, res) {
  res.send('Hello World!');
});

router.use('/users', require('./users'));
router.use('/auth', require('./auth'));
router.use('/diaries', require('./diaries'));
router.use('/contents', require('./contents'));
router.use('/main', require('./main'));
router.use('/uploads', require('./uploads'));
router.use('/notices', require('./notices'));
router.use('/members', require('./members'));

module.exports = router;