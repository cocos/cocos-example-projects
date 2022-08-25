

// SystemJS support.
window.self = window;
require("src/system.bundle.js");

const importMapJson = jsb.fileUtils.getStringFromFile("src/import-map.json");
const importMap = JSON.parse(importMapJson);
System.warmup({
    importMap,
    importMapUrl: 'src/import-map.json',
    defaultHandler: (urlNoSchema) => {
        require(urlNoSchema.startsWith('/') ? urlNoSchema.substr(1) : urlNoSchema);
    },
});

System.import('./src/application.js')
.then(({ Application }) => {
    return new Application();
}).then((application) => {
    return System.import('cc').then((cc) => {
        require('jsb-adapter/engine-adapter.js');
        return application.init(cc);
    }).then(() => {
        return application.start();
    });
}).catch((err) => {
    console.error(err.toString() + ', stack: ' + err.stack);
});
