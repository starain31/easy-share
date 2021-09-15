const express = require('express');
const router = express.Router();

const multer  = require('multer')
const upload = multer( {storage: multer.memoryStorage() }).single('file');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/files', upload, async function (req, res) {
  res.status(200).send({publicKey: "test", privateKey: "test"});
});

module.exports = router;
