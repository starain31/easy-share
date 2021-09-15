const express = require('express');
const path = require('path');
const multer  = require('multer')
const fs = require("fs");

const router = express.Router();
const upload = multer( {storage: multer.memoryStorage() }).single('file');

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/files', upload, async function (req, res) {
  res.status(200).send({publicKey: "test", privateKey: "test"});
});

router.get('/files/:publicKey?', async function (req, res) {
  try {
    const img = path.join(process.env.FOLDER, req.params.publicKey);

    const content =  fs.readFileSync(img);

    res.writeHead(200, { "Content-type": "application/pdf" });
    res.end(content);

  } catch (e) {
    console.error(e);
    res.status(404).send({message: "No such file or invalid key"});
  }
})

module.exports = router;
