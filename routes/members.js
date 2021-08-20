const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
const router = express.Router();
const DiaryRoom = require('../models/diaryRoom');
const Member = require('../models/member');
//const diariesController = require('../controllers/diaries.ctrl');

router.get("/:roomIdx", async (req, res, next) => {
	try {
		const memberList = await Member.findAndCountAll({
			where: {
				room_id: req.params.roomIdx
			},
			attributes: ['id', 'admin'],
			include: [{
				model: User,
				attributes: ['id', 'nick']
			}]
		}).then((memberList) => {
			res.status(201).json(memberList);
		})
	} catch (err) {
		console.error(err);
		next(err);
	}
});

router.post("/", async (req, res, next) => {
	try {
		Member.create({
			admin: false,
            user_id: req.user.id,
            room_id: req.body.room_id,
		}).then(() => {
			res.status(201).json();
		})
	} catch (err) {
		console.error(err);
		next(err);
	}
});

router.delete("/:memberIdx", async (req, res, next) => {
	try {
		Member.destroy({
			where: {
				id: req.params.memberIdx
			}
		}).then(() => {
		res.send("맴버 지워짐");
		})
	} catch (err) {
		console.error(err);
		next(err);
	}
});

module.exports = router;