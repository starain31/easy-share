const redis = require('redis');

async function create() {
    const redis_client = redis.createClient();

    redis_client.on('connect', () => console.log('Redis connected'));

    redis_client.on('disconnect', () => console.log("Redis disconnected"));

    redis_client.on('error', (err) => console.log('Redis Client Error', err));


    await redis_client.connect();

    async function save_keys({publicKey, privateKey, value}) {
        value = {...value, last_active_time: new Date().getTime()}
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

    async function increment_daily_request({key, time_window}) {
        const total_request = await redis_client.incr(key);
        if(total_request === 1) {
            await redis_client.expire(key, time_window);
        }
        return total_request;
    }

    async function clear_all() {
        return redis_client.flushAll();
    }

    async function get_by_pattern({pattern}) {
        return redis_client.keys(pattern)

    }

    return {
        save_keys,
        get_value_by_key,
        delete_by_key,
        disconnect,
        increment_daily_request,
        clear_all,
        get_by_pattern
    }
}

module.exports = create;
