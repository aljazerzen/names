const
  name = require('./controllers/name.controller'),
  express = require('express');

const router = express.Router();

router.get('/:name', name.getName);

router.post('/:name', name.addAdjective);

router.get('/:name/delete', name.cleanName);

router.all('*', (req, res) => {
  res.status(404).send();
});

module.exports = router;
