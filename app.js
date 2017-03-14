var express = require('express');
var app = express();
var hbs = require('express3-handlebars');
var mongo = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Connection URL 
var url = 'mongodb://localhost:' + (config.mongoPort || '27017') + '/' + (config.dbName || 'names');
var db;
var users;

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var index = 0;

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

String.prototype.hash = function() {
	var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; 
  }
	return hash;
}

var fonts = [
	"'Roboto', sans-serif",
	"'PT Sans', sans-serif",
	"'Raleway', sans-serif",
	"'Droid Sans', sans-serif",
	"'Playfair Display', serif",
	"'Lobster', cursive"
];

var colors = [
	'#222',
	'#fff',
	'#F50057',
	'#D500F9',
	'#651FFF',
	'#C6FF00'
];

var backgrounds = [
	'#fff',
	'#000',
	'#000',
	'#000',
	'#000',
	'#000'
];

app.get('/', function (req, res) {
	res.redirect('/ta stran');
});

app.get('/:name', function (req, res) {

	var hash = req.params.name.hash();
	var params = {
		'font-family': fonts[Math.floor(hash / colors.length) % fonts.length],
		color: colors[hash % colors.length],
		background: backgrounds[hash % backgrounds.length],
		weight: 100,
		name: req.params.name.capitalize()
	};

	users.findOne({ name: req.params.name }, {}, function(err, user) {

		if(!user || !user.adjectives || user.adjectives.length == 0) {
  		return res.render('index', params);
		}
	
		var next = ((user.last ? user.last : 0) + 1) % user.adjectives.length;
  	params.adjective = user.adjectives[next];
		res.render('index', params);
		user.last = next;
		users.update({ name: user.name }, user, {});
	});	
});

app.post('/:name', function (req, res) {

	var adjective = req.body.adjective;
	if(!adjective || !adjective.trim()) 
		return res.status(422).send('Missing adjective');
	adjective = adjective.trim();

	users.findOne({ name: req.params.name }, {}, function(err, user) { 

		if(!user) {
			users.insert({ 
				name: req.params.name, 
				last: 0,
				adjectives: [adjective] 
			}, function(err) {
				res.redirect('/' + req.params.name);
			});
			return;
		}
		
		if(!user.adjectives)
			user.adjectives = [];
		user.adjectives.push(adjective);
		user.last = user.adjectives.length - 2;

		users.update({ name: user.name }, user, {}, function(err) {
				res.redirect('/' + user.name);
		});
	});
});

app.get('/:name/delete', function(req, res) {
	password = config.password || 'pass';
	if(!req.query.password || req.query.password.trim() !== password.trim()) {
		return res.status(403).send('Wrong password');
	}
	users.remove({ name: req.params.name}, function(err) {
		res.redirect('/' + req.params.name);
	});
});

mongo.connect(url, function(err, db_local) {
	db = db_local;
	users = db.collection('users');
	app.listen(config.port || 80, function () {
		console.log('App running on port ' + (config.port || 80));
	});
});

