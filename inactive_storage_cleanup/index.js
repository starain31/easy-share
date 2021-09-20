function create_inactive_storage_cleanup({db, provider, FILE_INACTIVE_LIMIT}) {
    async function cleanup() {
        db.get_by_pattern({pattern: 'public*'})
            .then(get_all_file_details)
            .then(filter_inactive_files)
            .then(delete_all_files)
            .then(() => console.log('Inactive files deleted'))
            .catch((e) => console.error(e));
    }

    function filter_inactive_files(files_details) {
        return files_details.filter(is_inactive);
    }

    async function delete_all_files(inactive_files) {
        console.log(inactive_files.length);
        return Promise.all(
            inactive_files.map((file_detail) => provider.del({privateKey: file_detail.privateKey}))
        );
    }

    async function get_all_file_details(keys) {
        return Promise.all(keys.map((key) => db.get_value_by_key({key})))
    }

    function is_inactive(files_details) {
        return FILE_INACTIVE_LIMIT < (new Date().getTime() - files_details.last_active_time);
    }

    return {
        cleanup
    }
}

module.exports = create_inactive_storage_cleanup;
