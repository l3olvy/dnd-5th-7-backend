const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Notice = require('../models/notice');
const router = express.Router();
const DiaryRoom = require('../models/diaryRoom');
const Member = require('../models/member');
//const diariesController = require('../controllers/diaries.ctrl');

router.get("/", async (req, res, next) => {
	try {
		const notice = await Notice.findAll({
		})
		res.status(201).json(notice);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

router.get("/:noticeIdx", async (req, res, next) => {
	try {
		const notice = await Notice.findAll({
			where: {
				id: req.params.noticeIdx
			}
		})
		res.status(201).json(notice);
	} catch (err) {
		console.error(err);
		next(err);
	}
});


module.exports = router;