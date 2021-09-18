const {randomUUID} = require("crypto");
const path = require("path");
const fs = require("fs");

function create({db}) {
    async function post({file}) {
        const publicKey = `public-${randomUUID()}`;
        const privateKey = `private-${randomUUID()}`;

        const file_path = path.join(process.env.FOLDER, `${publicKey}_${file.originalname}`);

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

        fs.writeFileSync(file_path, file.buffer);

        return {publicKey, privateKey};
    }

    async function get({publicKey}) {
        const file_details = await db.get_value_by_key({key: publicKey});

        if (!file_details) {
            throw "No such file";
        }

        const content = fs.readFileSync(file_details.path);

        return {content, file_details}
    }

    async function del({privateKey}) {
        const file_details = await db.get_value_by_key({key: privateKey});

        if (!file_details || !file_details.path || !fs.existsSync(file_details.path)) {
            throw 'No such file';
        }

        fs.unlinkSync(file_details.path);
        await db.delete_by_key({key: privateKey});
    }

    return {
        post,
        get,
        del
    };
}

module.exports = create;
