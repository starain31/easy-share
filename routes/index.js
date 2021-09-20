const express = require('express');
const multer = require('multer')

function create_router({provider, upload_limiter, download_limiter}) {
    const router = express.Router();
    const upload = multer({storage: multer.memoryStorage()}).single('file');

    router.get('/', function (req, res) {
        res.render('index', {title: 'Express'});
    });

    router.post('/files', upload_limiter, upload, async function (req, res) {
        provider.post({file: req.file})
            .then(function ({privateKey, publicKey}) {
                res.status(200).send({publicKey, privateKey});
            })
            .catch(function (e) {
                console.error(e);
                res.status(500);
            })
    });

    router.get('/files/:publicKey?', download_limiter, async function (req, res) {
        provider.get({publicKey: req.params.publicKey})
            .then(function ({content, file_details}) {
                res.writeHead(200, {"Content-type": file_details.mimetype});
                res.end(content);
            })
            .catch(function (e) {
                console.error(e);
                res.status(404).send({message: "No such file or invalid key"});
            });

    });

    router.delete('/files/:privateKey', async function (req, res) {
        provider.del({privateKey: req.params.privateKey})
            .then(function () {
                res.status(200).send({message: "file has been deleted."});
            })
            .catch(function (e) {
                console.error(e);
                return res.status(400).send({message: "no such file or internal server error."});
            })
    });

    return router;

}

module.exports = create_router;
