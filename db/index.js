const redis = require("redis");
const client = redis.createClient({});

client.on("error", function (error) {
    console.error(error);
});

(async function db() {
    await client.connect();
})();

async function save_keys({publicKey, privateKey, value}) {
    await client.set(privateKey, JSON.stringify(value));
    await client.set(publicKey, JSON.stringify(value));
}

async function get_value_by_key({key}) {
    return JSON.parse(await client.get(key));
}

module.exports = {save_keys, get_value_by_key};
