const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
const router = express.Router();
const DiaryRoom = require('../models/diaryRoom');
const Member = require('../models/member');
//const diariesController = require('../controllers/diaries.ctrl');

router.post("/", isLoggedIn, async (req, res, next) => {
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
			//room.addMember(member);
			console.log("멤버생성 정보 : ", member);
		});
		console.log("방생성 정보 : ", room);

		res.status(201).json(room);
	} catch (err) {
		console.error(err);
		next(err);
	}
	/*const id = req.user.id;
	const title = req.body.title;
	console.log("타이틀 : ", title);

	res.send('good');
	const sqlQuery = "INSERT INTO DND57DB.diaryRoom (title) VALUES (?)"
		+ "INSERT INTO DND57DB.member (admin,user_id) VALUES (?,?);";
	connection.query(sqlQuery, [title, id, id], (err, result) => {
		res.send('good');
	})*/
});
module.exports = router;