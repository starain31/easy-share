const express = require('express');
const router = express.Router();

const multer  = require('multer')
const upload = multer({ dest: process.env.FOLDER }).single('file');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/files', upload, function (req, res) {
  res.status(200).send();
});

module.exports = router;
