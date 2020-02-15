class AppStorage {
    constructor() {
        this.inMemory = false;
        this.data = {};
    }

    get(key) {
        return new Promise((resolve, reject) => {
            if (this.inMemory) {
                resolve(this.data[key]);
            } else {
                resolve(localStorage.getItem(key));
            }
        });
    }

    set(key, value) {
        return new Promise((resolve, reject) => {
            if (this.inMemory) {
                this.data[key] = value;
            } else {
                localStorage.setItem(key, value);
            }
            resolve();
        });
    }

    remove(keys) {
        return new Promise((resolve, reject) => {
            keys.forEach(key => {
                if (this.inMemory) {
                    delete this.data[key];
                } else {
                    localStorage.removeItem(key);
                }
            });
            resolve();
        });
    }

    clear() {
        return new Promise((resolve, reject) => {
            if (this.inMemory) {
                this.data = {};
            } else {
                localStorage.clear();
            }
            resolve();
        });
    }
}