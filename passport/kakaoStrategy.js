const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const axios = require('axios');

const User = require('../models/user');

module.exports = () => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/kakao/callback',
  }, async (accessToken, refreshToken, _, done) => {

    const profile = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json'
      }
    });
    console.log('kakao profile', profile.data);
    try {
      const exUser = await User.findOne({
        where: { snsId: profile.data.id, },
      });
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await User.create({
          phothUrl: profile.data.kakao_account.profile.profile_image_url ? profile.data.kakao_account.profile.profile_image_url : null,
          nick: profile.data.kakao_account.profile.nickname,
          snsId: profile.data.id,
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
