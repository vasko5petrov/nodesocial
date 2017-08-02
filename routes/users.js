const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config/database');
const router = express.Router();

const User = require('../models/user');

router.post('/register', (req, res) => {
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	});

	User.addUser(newUser, (err, user) => {
		if(err) {
			res.json({success: false, msg: err.msg});
		} else {
			res.json({success: true, msg: "User registered"});
		}
	});
});

router.post('/authenticate', (req, res) => {
	let username = req.body.username;
	let password = req.body.password;

	if(username == undefined || password == undefined) {
		res.json({success: false, msg: "Please fill all fields"});
	}

	User.getUserByUsername(username, (err, user) => {
		if(err) throw err;
		if(!user) {
			return res.json({success: false, msg: "User not found"});
		}

		User.comparePasswords(password, user.password, (err, isMatch) => {
			if(err) throw err;
			if(isMatch) {
				const token = jwt.sign(user, config.secret, {
					expiresIn: 604800
				});

				res.json({
					success: true,
					token: 'JWT '+token,
					user: {
						name: user.name,
						email: user.email,
						username: user.username
					}
				})
			} else {
				return res.json({success: false, msg: "Wrong password"});
			}
		});
	});
});

router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res) => {
  	res.json({user: req.user});
});

module.exports = router;