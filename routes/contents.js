const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();
const DiaryContent = require('../models/diaryContent');
const util = require('../modules/util');
const { s3, s3bucket } = require('../config/s3');

const upload = require('../modules/multer');

router.post("/image", upload.single('imgUrl'), async (req, res, next) => { // 일기 생성
    try {
        const image = req.file;

        if (req.file) {
            DiaryContent.create({
                imgUrl: image.location,
                user_id: req.user.id,
                room_id: req.headers.room_id,
                date: getCurrentDate(),
            }).then(() => {
                res.status(201).send("이미지 업로드 성공");
            });
        }
        else {
            res.status(400).send(util.fail(400, "이미지가 존재하지 않습니다."));
        }

    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post("/images", upload.array('imgUrls'), async (req, res, next) => { // 일기 생성
    try {
        const image = req.files;
        if (image) {
            const imageArray = new Array();
            const object = new Object();

            image.map((img) => {
                object.imgUrl = img.location;
                object.user_id = req.user.id;
                object.room_id = req.headers.room_id;
                object.date = getCurrentDate();

                imageArray.push(object);
            });
            DiaryContent.bulkCreate(imageArray).then(() => {
                res.status(201).send("이미지 업로드 성공");
            });
        } else {
            res.status(400).send(util.fail(400, "이미지가 존재하지 않습니다."));
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post("/text", async (req, res, next) => { // 일기 생성 (텍스트)
    try {
        DiaryContent.create({
            text: req.body.text,
            user_id: req.user.id,
            room_id: req.headers.room_id,
            date: getCurrentDate(),
        }).then(() => {
            res.status(201).send("텍스트 업로드 성공");
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get("/list/:diaryIdx", async (req, res, next) => { // 일기 리스트  조회
    try {
        const diarylist = await DiaryContent.findAll({
            where: {
                room_id: req.params.diaryIdx
            }
        }).then((diarylist) => {
            res.status(201).json(diarylist);
        })
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get("/:contentIdx", async (req, res, next) => { // 일기 조회
    try {
        const diary = await DiaryContent.findOne({
            where: {
                id: req.params.contentIdx
            },
            raw: true,
        }).then((diary) => {
            diary.nick = req.user.nick;
            res.status(201).json(diary);
        })
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.patch("/:contentIdx", upload.single('imgUrl'), async (req, res, next) => { // 일기 수정
    try {
        if (req.file) {
            const key = await DiaryContent.findOne({
                attributes: ['imgUrl', 'room_id'],
                where: {
                    id: req.params.contentIdx
                }
            }).then((key) => {
                s3.deleteObject({
                    Bucket: s3bucket,
                    Key: key.dataValues.room_id + '/' + key.dataValues.imgUrl.split('/')[4]
                },
                    (err, data) => {
                        if (err) {
                            throw err;
                        }
                        console.log(data);
                    })
                const image = req.file.location;
                DiaryContent.update({
                    imgUrl: image,
                },
                    {
                        where: { id: req.params.contentIdx }
                    }
                ).then(() => {
                    res.status(201).send("이미지 수정 성공");
                });
            })
        } else {
            DiaryContent.update({
                text: req.body.text,
            },
                { where: { id: req.params.contentIdx } }
            ).then(() => {
                res.status(201).send("텍스트 수정 성공");
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete("/:contentIdx", async (req, res, next) => { // 일기 삭제
    try {
        const key = await DiaryContent.findOne({
            attributes: ['imgUrl', 'room_id'],
            where: {
                id: req.params.contentIdx
            }
        }).then((key) => {
            if (key.dataValues.imgUrl) {
                s3.deleteObject({
                    Bucket: s3bucket,
                    Key: key.dataValues.room_id + '/' + key.dataValues.imgUrl.split('/')[4]
                },
                    (err, data) => {
                        if (err) {
                            throw err;
                        }
                        console.log(data);
                    })
                DiaryContent.destroy({
                    where: { id: req.params.contentIdx }
                }).then(() => {
                    res.status(201).send("이미지 삭제 성공");
                });
            }
            else {
                DiaryContent.destroy({
                    where: { id: req.params.contentIdx }
                }).then(() => {
                    res.status(201).send("텍스트 삭제 성공");
                });
            }
        })
    } catch (err) {
        console.error(err);
        next(err);
    }
});

function getCurrentDate() {
    var date = new Date();
    var year = date.getFullYear().toString();

    var month = date.getMonth() + 1;
    month = month < 10 ? '0' + month.toString() : month.toString();

    var day = date.getDate();
    day = day < 10 ? '0' + day.toString() : day.toString();

    return year + '-' + month + '-' + day;
}

module.exports = router;