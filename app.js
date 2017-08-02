const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');

const config = require('./config/database');
const user = require('./routes/users');


mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
	console.log('Connected to DB: '+config.database);
});

mongoose.connection.on('error', (err) => {
	console.log(err);
});

const app = express();

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

app.listen(port, (err) => {
	if(err) throw err;
	console.log('Server started on port '+port);
});