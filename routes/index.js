var express = require('express');
var router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main', { title: 'Express' });
});
router.use('/user', require('./user'));
router.use('/auth', require('./auth'));


router.get('/main', isLoggedIn, (req, res) => {
  res.render('main', { title: '내 정보' });
});

module.exports = router;