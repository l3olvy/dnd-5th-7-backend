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

router.get("/:dairyIdx", async (req, res, next) => {
	try {
		const room = await DiaryRoom.findAll({
			where: {
				id: req.params.dairyIdx
			}
		})
		res.status(201).json(room);
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
		}).then((room) => {
			const member = Member.create({
				admin: true,
				user_id: req.user.id,
				room_id: room.id,
			})
		});
		res.status(201).json(room);
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
		if (bookmark.dataValues) {
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
						lock: req.body.lock,
						close: req.body.close
					}, {
					where: { id: diaryIdx },
				});
				res.send("수정됨");
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
		const diaryIdx = req.params.dairyIdx;
		const admin = await Member.findOne({
			attributes: ['admin'],
			where: {
				room_id: diaryIdx,
				user_id: req.user.id,
			}
		}).then((admin) => {
			if (admin.dataValues.admin === true) {
				DiaryRoom.destroy({
					where: {
						id: req.params.dairyIdx
					}
				});
				emptyBucket(req.params.dairyIdx);
				res.send("방 지워짐");
			}
			else {
				res.send("삭제권한 없음");
			}
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
		if (data.Contents.length === 0) {
			throw new Error('List of objects empty.');
		}

		currentData = data;

		params = { Bucket: s3bucket };
		params.Delete = { Objects: [] };

		currentData.Contents.forEach(content => {
			params.Delete.Objects.push({ Key: content.Key });
		});

		return s3.deleteObjects(params).promise();
	}).then(() => {
		if (currentData.Contents.length === 1000) {
			emptyBucket(s3bucket, callback);
		} else {
			return true;
		}
	});
}

module.exports = router;