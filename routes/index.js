const express = require('express');
const router = express.Router();

const multer  = require('multer')
const upload = multer({ dest: process.env.FOLDER })

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/files', upload.single('file'), function (req, res) {
  res.status(200).send();
});

module.exports = router;
