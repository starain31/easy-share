const redis = require('redis');

async function create() {
    const redis_client = redis.createClient();
    await redis_client.connect();

    console.log({redis_client});

    async function save_keys({publicKey, privateKey, value}) {
        await redis_client.set(publicKey, JSON.stringify(value));
        await redis_client.set(privateKey, JSON.stringify(value));
    }

    async function get_value_by_key({key}) {
        return JSON.parse(await redis_client.get(key));
    }

    async function delete_by_key({key}) {
        const {publicKey, privateKey} = await get_value_by_key({key});

        await redis_client.del(publicKey, privateKey);
    }

    async function disconnect() {
        return redis_client.disconnect();
    }

    return {
        save_keys,
        get_value_by_key,
        delete_by_key,
        disconnect
    }
}

module.exports = create;
