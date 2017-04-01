function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function hashString(string) {
  let hash = 0, i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return Math.abs(hash);
}

exports.getName = function (req, res) {

  let hash = hashString(req.params.name);
  let fonts = req.app.locals.config.themes.fonts;
  let colors = req.app.locals.config.themes.colors;
  let params = {
    'font-family': fonts[Math.floor(hash / colors.length) % fonts.length],
    color: colors[hash % colors.length].font,
    background: colors[hash % colors.length].background,
    weight: 100,
    name: capitalize(req.params.name)
  };

  req.app.locals.users.findOne({ name: req.params.name }, {}, function (err, user) {

    if (!user || !user.adjectives || user.adjectives.length === 0) {
      return res.render('index', params);
    }

    let next = ((user.last ? user.last : 0) + 1) % user.adjectives.length;
    params.adjective = user.adjectives[next];
    res.render('index', params);
    user.last = next;
    req.app.locals.users.update({ name: user.name }, user, {});
  });

};

exports.addAdjective = function (req, res) {

  let adjective = req.body.adjective;
  if (!adjective || !adjective.trim())
    return res.status(422).send('Missing adjective');
  adjective = adjective.trim();

  req.app.locals.users.findOne({ name: req.params.name }, {}, function (err, user) {

    if (!user) {
      req.app.locals.users.insert({
        name: req.params.name,
        last: 0,
        adjectives: [adjective]
      }, function () {
        res.redirect('/' + req.params.name);
      });
      return;
    }

    if (!user.adjectives)
      user.adjectives = [];
    user.adjectives.push(adjective);
    user.last = user.adjectives.length - 2;

    req.app.locals.users.update({ name: user.name }, user, {}, function () {
      res.redirect('/' + user.name);
    });
  });
};

exports.cleanName = function (req, res) {
  let password = req.app.locals.confi.password;
  if (!req.query.password || req.query.password.trim() !== password.trim()) {
    return res.status(403).send('Wrong password');
  }
  req.app.locals.users.remove({ name: req.params.name }, function () {
    res.redirect('/' + req.params.name);
  });
};