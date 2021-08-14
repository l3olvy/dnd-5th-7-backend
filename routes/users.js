const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
const router = express.Router();
const DiaryRoom = require('../models/diaryRoom');
const Member = require('../models/member');
//const diariesController = require('../controllers/diaries.ctrl');
const axios = require('axios');
require('dotenv').config();
const env = process.env;

router.get("/me", async (req, res, next) => { //본인 회원 정보 불러오기
    try {
        const user = await User.findAll({
            where: {
                id: req.user.id,
            }
        })
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.patch("/me", async (req, res, next) => { // 회원 정보 변경
    try {
        User.update({
            nick: req.body.nick,
            phothUrl: req.body.photoUrl
        }, {
            where: { id: req.user.id }
        })
        res.send("수정됨");
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete("/me", async (req, res, next) => { // 회원 탈퇴
    try {
        console.log("snsId : ", req.user.snsId);
        await axios.post('https://kapi.kakao.com/v1/user/unlink',
            formUrlEncoded({
                'target_id_type': 'user_id',
                'target_id': `${req.user.snsId}`
            }),
            {

                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`
                }
            }
        ).then((response) => {
            console.log("응답받은 id : ", response.data.id);
            User.destroy({
                where: { snsId: response.data.id }
            })
            res.send("탈퇴됨");
            req.logout();
            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                res.redirect('https://dnd-5th-7-frontend-3ugas3gw7-dndtido.vercel.app');
            });
        });

    } catch (err) {
        console.error(err);
        next(err);
    }
});

const formUrlEncoded = x =>
    Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '')

module.exports = router;