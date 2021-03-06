const {Storage} = require('@google-cloud/storage');
const {randomUUID} = require("crypto");
const path = require("path");
const fs = require("fs");

function create({db, CONFIG}) {
    const {keyFilename, bucketName} = JSON.parse(fs.readFileSync(CONFIG).toString());

    const bucket = new Storage({keyFilename}).bucket(bucketName);

    async function post({file}) {
        const publicKey = `public-${randomUUID()}`;
        const privateKey = `private-${randomUUID()}`;

        const file_path = path.join(`${publicKey}_${file.originalname}`);

        await bucket.file(file_path).save(file.buffer);

        await db.save_keys({
            publicKey,
            privateKey,
            value: {
                ...file,
                buffer: undefined,
                path: file_path,
                publicKey,
                privateKey
            }
        });
        return {publicKey, privateKey};
    }

    async function get({publicKey}) {
        const file_details = await db.get_value_by_key({key: publicKey});

        if (!file_details) {
            throw "No such file";
        }

        const content = await bucket.file(file_details.path).download();

        return {content: content[0], file_details}
    }

    async function del({privateKey}) {
        const file_details = await db.get_value_by_key({key: privateKey});

        if (!file_details || !file_details.path || !(await bucket.file(file_details.path).exists())) {
            throw 'No such file';
        }

        await bucket.file(file_details.path).delete();
        await db.delete_by_key({key: privateKey});
    }

    return {
        post,
        get,
        del
    };
}

module.exports = create;

