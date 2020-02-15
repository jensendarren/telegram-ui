class FileManager {
    constructor(api) {
        this.api = api;
        this.idToPromise = {};
    }

    getFile(location) {
        const id = location.dc_id + '_' + location.volume_id + '_' + location.local_id;

        const cache = this.idToPromise[id];
        if (cache) {
            return cache;
        }

        const promise = new Promise((resolve, reject) => {
            this.api.getFile(location)
                .then(file => resolve(bytesToUrl(file.bytes)));
        });

        this.idToPromise[id] = promise;

        return promise;
    }
}