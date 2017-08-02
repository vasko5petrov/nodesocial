const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.addUser = (newUser, callback) => {
	User.find({username : newUser.username}, function (err, docs) {
        if (docs.length){
        	callback({msg:'Username already exists'}, null);
        } else{
        	User.find({email: newUser.email}, function(err, data) {
        		if (data.length) {
        			callback({msg:'Email already exists'}, null);
        		} else {
        			bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if(err) callback({msg:'Failed to register user'}, null);
							newUser.password = hash;
							newUser.save(callback);
						});
					});
        		}
        	});
        }
    });
}

module.exports.getUserByUsername = (username, callback) => {
	const query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = (id, callback) => {
	User.findById(id, callback);
}

module.exports.comparePasswords = (candidatePassword, hash, callback) => {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if(err) throw err;
		callback(null, isMatch);
	});
}