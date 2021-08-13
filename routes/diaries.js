const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
const router = express.Router();
const DiaryRoom = require('../models/diaryRoom');
const Member = require('../models/member');
//const diariesController = require('../controllers/diaries.ctrl');

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

module.exports = router;