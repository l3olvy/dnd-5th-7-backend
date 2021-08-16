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
  res.redirect(`${process.env.FRONT_URL}/main`);
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.sendStatus(200);
  });
});

router.get('/id', isLoggedIn, (req, res) => {
  if (req.user) {
    res.send({ id: req.user.id });
  }
});

module.exports = router;