const local = require("./local_file_system_storage");

const PROVIDER = {
    GOOGLE: 'google',
    LOCAL: 'local'
}

function storage_provider({provider, db}) {
    switch (provider) {
        case PROVIDER.LOCAL:
            return local({db});
    }
}

module.exports = storage_provider;
