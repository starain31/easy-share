const local = require("./local_file_system_storage");

const PROVIDER = {
    GOOGLE: 'google',
    LOCAL: 'local'
}

function storage_provider({provider_name, db, upload_folder}) {
    switch (provider_name) {
        case PROVIDER.LOCAL:
            return local({db, upload_folder});
    }
}

module.exports = storage_provider;
