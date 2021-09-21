const local_file_system_storage = require("./local_file_system_storage");
const google_cloud_storage  = require('./google_cloud_storage');

const PROVIDERS = {
    GOOGLE: 'google',
    LOCAL: 'local'
}

function storage_provider({PROVIDER, db, FOLDER, CONFIG}) {
    switch (PROVIDER) {
        case PROVIDERS.GOOGLE:
            return google_cloud_storage({db, CONFIG});

        case PROVIDERS.LOCAL:
        default:
            return local_file_system_storage({db, FOLDER});
    }
}

module.exports = storage_provider;
