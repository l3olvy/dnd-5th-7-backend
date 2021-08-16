const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
const router = express.Router();
const DiaryRoom = require('../models/diaryRoom');
const Member = require('../models/member');
const Bookmark = require('../models/bookmark');
//const diariesController = require('../controllers/diaries.ctrl');
const { s3, s3bucket } = require('../config/s3');
const Alarm = require('../models/alarm');

router.get("/:dairyIdx", async (req, res, next) => {
	try {
		const room = await DiaryRoom.findOne({
			where: {
				id: req.params.dairyIdx
			},
			raw: true,
		}).then((room) => {
			res.status(201).json(room);
		})
	} catch (err) {
		console.error(err);
		next(err);
	}
});

router.post("/", async (req, res, next) => {
	try {
		const room = await DiaryRoom.create({
			mood: req.body.mood,
			date: req.body.date,
			title: req.body.title,
			user_id: req.user.id,
		}).then((room) => {
			const member = Member.create({
				admin: true,
				user_id: req.user.id,
				room_id: room.id,
			}).then((member) => {
				res.status(201).json({ "room_id": room.id });
			})
		});
	} catch (err) {
		console.error(err);
		next(err);
	}
});

router.post("/bookmark", async (req, res, next) => { // 즐겨찾기 등록
	try {
		const bookmark = await Bookmark.findAll({
			where: {
				user_id: req.user.id,
				room_id: req.body.room_id,
			}
		})
		if (bookmark.length !== 0) {
			await Bookmark.destroy({
				where: {
					user_id: req.user.id,
					room_id: req.body.room_id,
				}
			}).then(() => {
				res.status(200).json("즐겨찾기 등록 해제");
			})
		} else {
			await Bookmark.create({
				user_id: req.user.id,
				room_id: req.body.room_id,
			}).then(() => {
				res.status(201).json("즐겨찾기 등록");
			})
		}
	} catch (err) {
		console.error(err);
		next(err);
	}
});

router.patch("/:dairyIdx", async (req, res, next) => {
	try {
		const diaryIdx = req.params.dairyIdx;
		const admin = await Member.findOne({
			attributes: ['admin'],
			where: {
				room_id: diaryIdx,
				user_id: req.user.id,
			}
		}).then((admin) => {
			if (admin.dataValues.admin === true) {
				DiaryRoom.update(
					{
						mood: req.body.mood,
						date: req.body.date,
						title: req.body.title,
					}, {
					where: { id: diaryIdx },
				}).then(() => {
					res.send("수정됨");
				});
			}
			else {
				res.send("수정권한 없음");
			}
		})

	} catch (err) {
		console.error(err);
		next(err);
	}
});

router.delete("/:dairyIdx", async (req, res, next) => {
	try {
		let diaryIdx = req.params.dairyIdx;
		const title = await DiaryRoom.findOne({
			attributes: ['title'],
			where: {
				id: diaryIdx
			},
			raw: true,
		})
		const member = await Member.findAll({
			attributes: ['user_id'],
			where: {
				room_id: diaryIdx,
				admin: false,
			},
			raw: true,
		}).then((member) => {
			const memberArray = member.map(function (value, index) {
				value.title = title.title;
				value.delete = getCurrentDate();
				return value;
			})
			Alarm.bulkCreate(memberArray);
			DiaryRoom.destroy({
				where: {
					id: diaryIdx
				}
			}).then(() => {
				emptyBucket(diaryIdx);
				res.send("방 지워짐");
			})

		})
	} catch (err) {
		console.error(err);
		next(err);
	}
});

function emptyBucket(room_id) {
	let currentData;
	let params = {
		Bucket: s3bucket,
		Prefix: `${room_id}/`
	};

	return s3.listObjects(params).promise().then(data => {
		if (data.Contents.length !== 0) {
			currentData = data;

			params = { Bucket: s3bucket };
			params.Delete = { Objects: [] };

			currentData.Contents.forEach(content => {
				params.Delete.Objects.push({ Key: content.Key });
			});

			return s3.deleteObjects(params).promise();
		}


	}).then(() => {
		if (currentData) {
			if (currentData.Contents.length === 1000) {
				emptyBucket(s3bucket, callback);
			} else {
				return true;
			}
		}
	});
}

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