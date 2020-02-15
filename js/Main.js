let telegram = null;

require(['mtproto2-browser.js'], lib => {
    const mainView = new MainView();
    mainView.init();
    console.warn(lib)
    const config = {
        id: 1061423, // https://my.telegram.org/apps
        hash: '219d8193583c9d5d9f78f270dafa2653'
    };

    const storage = new AppStorage();
    const mtProto = lib.MTProto({
            server: {
                dev: true,
                webogram: true
            },
            api: {
                layer: 57,
                initConnection: 0x69796de9,
                api_id: config.id
            },
            app: {
                storage: storage
            }
        }
    );

    const api = new Api(config, mtProto, lib.CryptoWorker);
    telegram = new Controller(mainView, api, storage);
});