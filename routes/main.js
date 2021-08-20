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
const Alarm = require('../models/alarm');
const sequelize = require("sequelize");
const { Sequelize } = require('sequelize');
const Op = sequelize.Op;

//const diariesController = require('../controllers/diaries.ctrl');

router.get("/calendar/:date", async (req, res, next) => {
    try {
        const date = req.params.date;
        const calendar = await Member.findAll({
            where: {
                user_id: req.user.id,
            },
            attributes: [],
            include: [{
                model: DiaryRoom,
                attributes: ["id", "date"],
                where: {
                    date: {
                        [Op.like]: "%" + date + "%"
                    },
                },
                include: [{
                    model: Bookmark,
                    attributes: ["id"]
                }]
            }],
            order: ['id'],
        })
        res.status(201).json(calendar);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get("/calendarDatail/:date", async (req, res, next) => {
    try {
        const date = req.params.date;

        const memberList = await DiaryRoom.findAll({
            include: [{
                model: Member,
                attributes: ["id", "admin", "user_id",],
                include: [{
                    model: User,
                    attributes: ["photoUrl"]
                }],
            }],
            where: {
                date: {
                    [Op.like]: "%" + date + "%"
                },
            },
        }).then((memberList) => {
            res.status(201).json(memberList);
        })
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get("/bookmark", async (req, res, next) => {
    try {
        const bookmark = await Bookmark.findAll({
            attributes: [],
            include: [{
                model: DiaryRoom,
                attributes: ["id", "date", "title"]
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
});

router.get("/bookmarkList/:desc", async (req, res, next) => {
    try {
        if (req.params.desc == 'true') {
            const bookmark = await Bookmark.findAll({
                attributes: ["id"],
                include: [{
                    model: DiaryRoom,
                    include: [{
                        model: Member,
                        attributes: ["user_id"],
                        include: [{
                            model: User,
                            attributes: ["photoUrl"]
                        }]
                    }]
                }],
                where: {
                    user_id: req.user.id
                },
                order: [[DiaryRoom, 'date', 'DESC']],
            }).then((bookmark) => {
                res.status(201).json(bookmark);
            })
        } else {
            const bookmark = await Bookmark.findAll({
                attributes: [],
                include: [{
                    model: DiaryRoom,
                    include: [{
                        model: Member,
                        attributes: ["user_id"],
                        include: [{
                            model: User,
                            attributes: ["photoUrl"]
                        }]
                    }]
                }],
                where: {
                    user_id: req.user.id
                },
                order: [[DiaryRoom, 'date', 'ASC']],
            }).then((bookmark) => {
                res.status(201).json(bookmark);
            })
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get("/inProgress", async (req, res, next) => {
    try {
        const room = await Member.findAll({
            attributes: [],
            where: {
                user_id: req.user.id,
            },
            include: [{
                model: DiaryRoom,
                attributes: ["id", "date", "title", "mood"]
            }],
            order: [['id', 'DESC']],
            limit: 5
        })
        res.status(201).json(room);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get("/inProgressList/:desc", async (req, res, next) => {
    try {
        if (req.params.desc == "true") {
            const room = await Member.findAll({
                attributes: ["id"],
                where: {
                    user_id: req.user.id,
                },
                include: [{
                    model: DiaryRoom,
                    include: [{
                        model: Member,
                        attributes: ["user_id",],
                        include: [{
                            model: User,
                            attributes: ["photoUrl"]
                        }]
                    }]
                }],
                order: [[DiaryRoom, 'date', 'DESC']],
            }).then((room) => {
                res.status(201).json(room);
            })
        } else {
            const room = await Member.findAll({
                attributes: ["id"],
                where: {
                    user_id: req.user.id,
                },
                include: [{
                    model: DiaryRoom,
                    include: [{
                        model: Member,
                        attributes: ["user_id",],
                        include: [{
                            model: User,
                            attributes: ["photoUrl"]
                        }]
                    }]
                }],
                order: [[DiaryRoom, 'date', 'ASC']],
            }).then((room) => {
                res.status(201).json(room);
            })
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post("/search", async (req, res, next) => {
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
                    attributes: ["id", "admin"],
                    include: [{
                        model: DiaryRoom,
                        attributes: ["id", "date", "title",],
                        where: {
                            title: {
                                [Op.like]: "%" + title + "%"
                            }
                        },
                        include: [{
                            model: DiaryContent,
                            attributes: ["id", "text", "imgUrl"],
                        }]
                    }],
                    order: [['id', 'DESC']]
                });

                const amount = await Member.count({
                    where: {
                        user_id: req.user.id,
                    },
                    attributes: ["id", "admin"],
                    include: [{
                        model: DiaryRoom,
                        attributes: ["id", "date", "title",],
                        where: {
                            title: {
                                [Op.like]: "%" + title + "%"
                            }
                        }
                    }],
                    order: [['id', 'DESC']]
                });

                const result = []
                result.push(room, amount)

                console.log(amount);
                res.status(201).json(result);
            }

            if (searchContent) {
                const room = await Member.findAll({
                    where: {
                        user_id: req.user.id,
                    },
                    attributes: ["id", "admin"],
                    include: [{
                        model: DiaryRoom,
                        attributes: ["id", "date", "title",],
                        include: [{
                            model: DiaryContent,
                            where: {
                                text: {
                                    [Op.like]: "%" + content + "%"
                                }
                            },
                            attributes: ["id", "text", "imgUrl"],
                        }]

                    }],
                    order: [['id', 'DESC']]
                });

                res.status(201).json(room);
            }

            if (searchMember) {
                const room = await User.findAll({
                    where: {
                        nick: {
                            [Op.like]: "%" + member + "%"
                        }
                    },
                    attributes: ["id", "nick"],
                    include: [{
                        model: Member,
                        attributes: ["id", "admin"],
                        include: [{
                            model: DiaryRoom,
                            required: true,
                            attributes: ["id", "date", "title"],
                            include: [{
                                model: DiaryContent,
                                distinct: true,
                                attributes: ["id", "text", "imgUrl"],
                            }]
                        }]
                    }],
                });
                const amount = await User.count({
                    where: {
                        nick: {
                            [Op.like]: "%" + member + "%"
                        }
                    },
                    attributes: ["id", "nick"],
                    include: [{
                        model: Member,
                        attributes: ["id", "admin"],
                        include: [{
                            model: DiaryRoom,
                            required: true,
                            attributes: ["id", "date", "title"],
                        }]
                    }],
                });

                const result = []
                result.push(room, amount)

                console.log(amount);
                res.status(201).json(result);
            }
        } else {
            if (searchTitle) {
                const room = await Member.findAll({
                    where: {
                        user_id: req.user.id,
                    },
                    attributes: ["id", "admin"],
                    include: [{
                        model: DiaryRoom,
                        attributes: ["id", "date", "title",],
                        where: {
                            title: {
                                [Op.like]: "%" + title + "%"
                            }
                        },
                        include: [{
                            model: DiaryContent,
                            attributes: ["id", "text", "imgUrl"],
                        }]
                    }],
                    order: ['id']
                });

                const amount = await Member.count({
                    where: {
                        user_id: req.user.id,
                    },
                    attributes: ["id", "admin"],
                    include: [{
                        model: DiaryRoom,
                        attributes: ["id", "date", "title",],
                        where: {
                            title: {
                                [Op.like]: "%" + title + "%"
                            }
                        }
                    }],
                    order: [['id', 'DESC']]
                });

                const result = []
                result.push(room, amount)

                console.log(amount);
                res.status(201).json(result);
            }

            if (searchContent) {
                const room = await Member.findAndCountAll({
                    where: {
                        user_id: req.user.id,
                    },
                    attributes: ["id", "admin"],
                    include: [{
                        model: DiaryRoom,
                        attributes: ["id", "date", "title",],
                        include: [{
                            model: DiaryContent,
                            where: {
                                text: {
                                    [Op.like]: "%" + content + "%"
                                }
                            },
                            attributes: ["id", "text", "imgUrl"],
                        }]

                    }],
                    order: ['id']
                });
                res.status(201).json(room);
            }

            if (searchMember) {
                const room = await User.findAll({
                    where: {
                        nick: {
                            [Op.like]: "%" + member + "%"
                        }
                    },
                    attributes: ["id", "nick"],
                    include: [{
                        model: Member,
                        attributes: ["id", "admin"],
                        include: [{
                            model: DiaryRoom,
                            required: true,
                            attributes: ["id", "date", "title"],
                            include: [{
                                model: DiaryContent,
                                distinct: true,
                                attributes: ["id", "text", "imgUrl"],
                            }]
                        }]
                    }],
                });

                const amount = await User.count({
                    where: {
                        nick: {
                            [Op.like]: "%" + member + "%"
                        }
                    },
                    attributes: ["id", "nick"],
                    include: [{
                        model: Member,
                        attributes: ["id", "admin"],
                        include: [{
                            model: DiaryRoom,
                            required: true,
                            attributes: ["id", "date", "title"],
                        }]
                    }],
                });

                const result = []
                result.push(room, amount)

                res.status(201).json(result);
            }
        }

    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get("/newAlarm", async (req, res, next) => {
    try {
        const newAlarm = await Alarm.count({
            where: {
                user_id: req.user.id,
                read: null
            },
        }).then((newAlarm) => {
            res.send({ "newAlarm": newAlarm });
        })
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get("/alarmList", async (req, res, next) => {
    try {
        const alarmList = await Alarm.findAll({
            where: {
                user_id: req.user.id,
            },
        }).then((alarmList) => {
            res.status(200).json(alarmList);
            Alarm.update(
                {
                    read: true
                }, {
                where: { user_id: req.user.id, },
            })
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});// 현재 맴버가 정립되지 않아서 게스트 테스트 필요 + 주인 정보와 필요한 정보 정제 필요

module.exports = router;