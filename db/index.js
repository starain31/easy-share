const files_details = {

}

async function save_keys({publicKey, privateKey, value}) {
    files_details[publicKey] =files_details[privateKey] = value;
}

async function get_value_by_key({key}) {
    return files_details[key];
}

async function delete_by_key({key}) {
    const {publicKey, privatKey} = await get_value_by_key({key});
    delete files_details[publicKey];
    delete files_details[privatKey];
}

module.exports = {save_keys, get_value_by_key, delete_by_key};
