const
  express = require('express'),
  hbs = require('express3-handlebars'),
  mongo = require('mongodb').MongoClient,
  bodyParser = require('body-parser'),
  fs = require('fs');

function initDb(app, callback) {

  let url = 'mongodb://' + app.locals.config.mongoUrl + ':' + app.locals.config.mongoPort + '/' + app.locals.config.mongoDbName;
  mongo.connect(url, function (err, db_local) {
    if(err) {
      console.error(err);
      return;
    }
    app.locals.db = db_local;
    app.locals.users = app.locals.db.collection('users');
    if (callback) callback();
  });
}

function initExpress(app, callback) {

  app.set('views', 'server/views/');
  app.use(express.static('public'));

  app.engine('handlebars', hbs());
  app.set('view engine', 'handlebars');

  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  // Init routes
  require('./routes')(app);

  app.listen(app.locals.config.port, callback);
}

function start() {
  let app = express();

  // Load config
  app.locals.config = require('./config');

  initDb(app, function () {
    initExpress(app, function() {
      console.log('App started')
    })
  });
}

start();