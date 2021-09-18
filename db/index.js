const files_details = {

}

async function save_keys({publicKey, privateKey, value}) {
    files_details[publicKey] =files_details[privateKey] = value;
}

async function get_value_by_key({key}) {
    return files_details[key];
}

module.exports = {save_keys, get_value_by_key};
