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

    return {
        post
    };
}

module.exports = create;
