const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);
const MongoClient  = require('mongodb').MongoClient;

const config = require('./config/database');
const user = require('./routes/users');

MongoClient.connect(config.database, (err, database) => {
    if (err) return console.log(err)
    db = database
	app.listen(5000, (err) => {
		if(err) throw err;
		console.log('mongodb listenning on port '+5000);
	});

	function databaseStore(messageData) {
		let storeData = {chatMessage: messageData.message, user:messageData.user, timestamp: new Date().getTime()}
		db.collection('chats').save(storeData, (err, result) => {
			if(err) throw err;
			//console.log('saved to database');
		});
	}

	io.on('connection', (socket) => {
		//console.log('user connected');

		socket.on('disconnect', () => {
			//console.log('user disconnected');
		});

		socket.on('add-message', (messageData) => {
			io.emit('message', {type: 'new-message', chatMessage: messageData.message, user: messageData.user, timestamp: new Date().getTime()});
			databaseStore(messageData);
		});

			db.collection('chats').find().limit(100).sort({_id:1}).toArray(function(err, res){
	            if(err){
	                throw err;
	            }

	            // Emit the messages
	            socket.emit('output', res);
	        });

	    socket.on('clear', function(data){
            // Remove all chats from collection
            db.collection('chats').remove({}, function(){
                // Emit cleared
                socket.emit('cleared');
            });
        });
	});


});

mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
	console.log('Connected to DB: '+config.database);
});

mongoose.connection.on('error', (err) => {
	console.log(err);
});

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session()); 

require('./config/passport')(passport);

app.use('/users', user);

app.get('/', (req, res) => {
	res.send('Invalid Endpoint');
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

const port = process.env.PORT || 3000;

http.listen(port, (err) => {
	if(err) throw err;
	console.log('Server started on port '+port);
});