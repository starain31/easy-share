const create = require("./local_file_system_storage");

const PROVIDER = {
    GOOGLE: 'google',
    LOCAL: 'local'
}

function storage_provider({provider, db}) {
    switch (provider) {
        case PROVIDER.LOCAL:
            return create({db});
    }
}

module.exports = storage_provider;
