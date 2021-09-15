const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/files', function (req, res) {
  res.status(200).send();
})

module.exports = router;
