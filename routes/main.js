const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
const router = express.Router();
const DiaryRoom = require('../models/diaryRoom');
const Member = require('../models/member');
const Bookmark = require('../models/bookmark');
const DiaryContent = require('../models/diaryContent');
const sequelize = require("sequelize");
const Op = sequelize.Op;

//const diariesController = require('../controllers/diaries.ctrl');

router.get("/bookmark", async (req, res, next) => {
    try {
        const bookmark = await Bookmark.findAll({
            include: [{
                model: DiaryRoom
            }],
            where: {
                user_id: req.user.id
            },
            order: [['id', 'DESC']],
            limit: 5
        })
        res.status(201).json(bookmark);
    } catch (err) {
        console.error(err);
        next(err);
    }
});//주인 정보와 필요한 정보 정제 필요

router.get("/inProgress", async (req, res, next) => {
    try {
        const room = await Member.findAll({
            where: {
                user_id: req.user.id,
            },
            include: [{
                model: DiaryRoom,
                where: {
                    lock: false
                }
            }],
            order: [['id', 'DESC']],
            limit: 5
        })
        res.status(201).json(room);
    } catch (err) {
        console.error(err);
        next(err);
    }
});// 현재 맴버가 정립되지 않아서 게스트 테스트 필요 + 주인 정보와 필요한 정보 정제 필요

router.get("/search", async (req, res, next) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const member = req.body.member;
        const desc = req.body.desc;
        const searchTitle = req.body.searchTitle;
        const searchContent = req.body.searchContent;
        const searchMember = req.body.searchMember;

        if (desc) {
            if (searchTitle) {
                const room = await Member.findAll({
                    where: {
                        user_id: req.user.id,
                    },
                    include: [{
                        model: DiaryRoom,
                        where: {
                            title: {
                                [Op.like]: "%" + title + "%"
                            }
                        }
                    }],
                    order: [['id', 'DESC']]
                });
                res.status(201).json(room);
            }

            if (searchContent) {
                const room = await Member.findAll({
                    where: {
                        user_id: req.user.id,
                    },
                    include: [{
                        model: DiaryRoom,
                        where: {
                            [Op.or]: [
                                {
                                    title: {
                                        [Op.like]: "%" + title + "%"
                                    }
                                },
                                {
                                    content: {
                                        [Op.like]: "%" + content + "%"
                                    }
                                }
                            ]
                        }
                    }],
                    order: [['id', 'DESC']]
                });
                res.status(201).json(room);
            }

            if (member) {
                const room = await User.findAll({
                    where: {
                        nick: {
                            [Op.like]: "%" + member + "%"
                        }
                    },
                    include: [{
                        model: Member,
                        include: [{
                            model: DiaryRoom,
                            include: [{
                                model: DiaryContent,
                            }]
                        }]
                    }],
                    order: [['id', 'DESC']]
                });
                res.status(201).json(room);
            }
        } else {
            if (searchTitle) {
                const room = await Member.findAll({
                    where: {
                        user_id: req.user.id,
                    },
                    include: [{
                        model: DiaryRoom,
                        where: {
                            title: {
                                [Op.like]: "%" + title + "%"
                            }
                        }
                    }],
                    order: ['id']
                });
                res.status(201).json(room);
            }

            if (searchContent) {
                const room = await Member.findAll({
                    where: {
                        user_id: req.user.id,
                    },
                    include: [{
                        model: DiaryRoom,
                        where: {
                            [Op.or]: [
                                {
                                    title: {
                                        [Op.like]: "%" + title + "%"
                                    }
                                },
                                {
                                    content: {
                                        [Op.like]: "%" + content + "%"
                                    }
                                }
                            ]
                        }
                    }],
                    order: ['id']
                });
                res.status(201).json(room);
            }

            if (member) {
                const room = await User.findAll({
                    where: {
                        nick: {
                            [Op.like]: "%" + member + "%"
                        }
                    },
                    include: [{
                        model: Member,
                        include: [{
                            model: DiaryRoom,
                            include: [{
                                model: DiaryContent,
                            }]
                        }]
                    }],
                    order: ['id']
                });
                res.status(201).json(room);
            }
        }

    } catch (err) {
        console.error(err);
        next(err);
    }
});





module.exports = router;