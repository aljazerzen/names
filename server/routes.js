const
  name = require('./controllers/name.controller');

module.exports = function (app) {


  app.get('/', function (req, res) {
    res.redirect('/ta stran');
  });

  app.get('/:name', name.getName);

  app.post('/:name', name.addAdjective);

  app.get('/:name/delete', name.cleanName);
};
