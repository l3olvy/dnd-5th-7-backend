const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
const router = express.Router();
//const diariesController = require('../controllers/diaries.ctrl');

//router.post('/:diaryIdx', isLoggedIn, diariesController.insertDiary);

router.post("/", isLoggedIn, (req, res) => {
	const id = req.user.id;
	const title = req.body.title;
	console.log("타이틀 : ", title);
	res.send('good');
	/*const sqlQuery = "INSERT INTO DND57DB.diaryRoom (title) VALUES (?)"
		+ "INSERT INTO DND57DB.member (admin,user_id) VALUES (?,?);";
	connection.query(sqlQuery, [title, id, id], (err, result) => {
		res.send('good');
	})*/
});
module.exports = router;