const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  console.log("res 값 : ", res);
  res.redirect('https://dnd-5th-7-frontend-eight.vercel.app/main');
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('https://dnd-5th-7-frontend-eight.vercel.app');
  });
});

router.get('/id', isLoggedIn, (req, res) => {
  if (req.user) {
    res.send({ id: req.user.id });
  }
});

module.exports = router;