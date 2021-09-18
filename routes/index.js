const express = require('express');
const multer = require('multer')
const fs = require("fs");
const db = require("../db");

function create_router({provider}) {

    const router = express.Router();
    const upload = multer({storage: multer.memoryStorage()}).single('file');

    router.get('/', function (req, res) {
        res.render('index', {title: 'Express'});
    });

    router.post('/files', upload, async function (req, res) {
        provider.post({file: req.file})
            .then(function ({privateKey, publicKey}) {
                res.status(200).send({publicKey, privateKey});
            })
            .catch(function (e) {
                console.error(e);
                res.status(500);
            })
    });

    router.get('/files/:publicKey?', async function (req, res) {
        try {
            const file = await db.get_value_by_key({key: req.params.publicKey});
            if (file === undefined) {
                throw "No such file";
            }

            const content = fs.readFileSync(file.path);

            res.writeHead(200, {"Content-type": file.mimetype});
            res.end(content);
        } catch (e) {
            console.error(e);
            res.status(404).send({message: "No such file or invalid key"});
        }
    });

    router.delete('/files/:privateKey', async function (req, res) {
        const file_details = await db.get_value_by_key({key: req.params.privateKey});

        if (!file_details || !file_details.path || !fs.existsSync(file_details.path)) {
            return res.status(400).send({message: "no such file or internal server error."});
        }

        fs.unlinkSync(file_details.path);
        await db.delete_by_key({key: req.params.privateKey});

        res.status(200).send({message: "file has been deleted."});
    });

    return router;

}

module.exports = create_router;
