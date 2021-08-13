var express = require('express');
var router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('main', { title: 'Express' });
});*/
router.get('/', function (req, res) {
  res.send('Hello World!');
});
router.use('/user', require('./user'));
router.use('/auth', require('./auth'));
router.use('/diaries', require('./diaries'));
router.use('/contents', require('./contents'));
/*
router.get('/main',(req, res) => {
  if(req.user){
    console.log(req.user.nick);
    res.send({id : req.user.nick});
  }
});
*/
module.exports = router;