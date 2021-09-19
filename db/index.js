const redis = require('redis');

async function create() {
    const redis_client = redis.createClient({});
    await redis_client.connect();

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
        await new Promise((resolve) => {
            redis.quit(() => {
                resolve();
            });
        });
        // redis.quit() creates a thread to close the connection.
        // We wait until all threads have been run once to ensure the connection closes.
        await new Promise(resolve => setImmediate(resolve));
    }

    return {
        save_keys,
        get_value_by_key,
        delete_by_key,
        disconnect
    }
}

module.exports = create;
