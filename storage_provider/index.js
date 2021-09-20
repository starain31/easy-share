const local = require("./local_file_system_storage");

const PROVIDERS = {
    GOOGLE: 'google',
    LOCAL: 'local'
}

function storage_provider({PROVIDER, db, FOLDER}) {
    switch (PROVIDER) {
        case PROVIDERS.LOCAL:
            return local({db, FOLDER});
    }
}

module.exports = storage_provider;
