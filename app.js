const express = require('express')
const mysql = require('mysql')
const dbconfig = require('./config/db.js')
const connection = mysql.createConnection(dbconfig);

const app = express()

app.listen(3000, function() {
	console.log("start! express server on port 3000")
})

app.get('/', function(req, res) {
	res.send("<h1>hi friend!!</h1>")
})

connection.connect(function(err) {
	if(err) {
		throw err;
	} else {
		connection.query("SELECT * FROM fruit", function(err, rows, fields) {
			console.log(rows);
		})
	}
})