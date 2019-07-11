var settings = window._CCSettings;

function boot () {
    var onStart = function () {
        window._CCSettings = undefined;

        cc.loader.downloader._subpackages = settings.subpackages;
        cc.view.enableRetina(true);
        cc.view.resizeWithBrowserSize(true);
		
		if (cc.sys.isMobile) {
			if (settings.orientation === 'landscape') {
				cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
			} else if (settings.orientation === 'portrait') {
				cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
			}
			cc.view.enableAutoFullScreen(false);
		}
        
        var launchScene = settings.launchScene;
        // load scene
        cc.director.loadScene(launchScene, null,
            function () {
                cc.view.setDesignResolutionSize(960, 640, 4);
                cc.loader.onProgress = null;
                console.log('Success to load scene: ' + launchScene);
            }
        );
    };

    loadJsListModules(settings.jsList).then(function () {
        (boot.systemGlobal || System)['import']('virtual:///prerequisite-imports:main').then(function () {
            cc.game.run(onStart);
        }).catch(function (error) {
            console.error("Load project module error: \n" + error);
        });
    });
};
window.boot = boot;

// Generate options to init cc.game
function initOptions () {

    var uuids = settings.uuids;
    var rawAssets = settings.rawAssets;
    var assetTypes = settings.assetTypes;
    var realRawAssets = settings.rawAssets = {};
    for (var mount in rawAssets) {
        var entries = rawAssets[mount];
        var realEntries = realRawAssets[mount] = {};
        for (var id in entries) {
            var entry = entries[id];
            var type = entry[1];
            // retrieve minified raw asset
            if (typeof type === 'number') {
                entry[1] = assetTypes[type];
            }
            // retrieve uuid
            realEntries[uuids[id] || id] = entry;
        }
    }
    var scenes = settings.scenes;
    for (var i = 0; i < scenes.length; ++i) {
        var scene = scenes[i];
        if (typeof scene.uuid === 'number') {
            scene.uuid = uuids[scene.uuid];
        }
    }
    var packedAssets = settings.packedAssets;
    for (var packId in packedAssets) {
        var packedIds = packedAssets[packId];
        for (var j = 0; j < packedIds.length; ++j) {
            if (typeof packedIds[j] === 'number') {
                packedIds[j] = uuids[packedIds[j]];
            }
        }
    }
    var subpackages = settings.subpackages;
    for (var subId in subpackages) {
        var uuidArray = subpackages[subId].uuids;
        if (uuidArray) {
            for (var k = 0, l = uuidArray.length; k < l; k++) {
                if (typeof uuidArray[k] === 'number') {
                    uuidArray[k] = uuids[uuidArray[k]];
                }
            }
        }
    }

    // asset library options
    const assetOptions = {
        libraryPath: 'res/import',
        rawAssetsBase: 'res/raw-',
        rawAssets: settings.rawAssets,
        packedAssets: settings.packedAssets,
        md5AssetsMap: settings.md5AssetsMap,
        subPackages: settings.subpackages
    };
    const options = {
        scenes: settings.scenes,
        debugMode: settings.debug ? 1 : 3, // cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: !false && settings.debug,
        frameRate: 60,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
        renderPipeline: settings.renderPipeline,
        adapter: prepare.findCanvas('GameCanvas'),
        assetOptions,
        customJointTextureLayouts: settings.customJointTextureLayouts || [],
    };
    return options;
}

// Load all project scripts (built by creator)
function loadJsListModules(jsList) {
    // jsList
    var promises = [];
    if (jsList) {
        jsList.forEach(function (x) {
            promises.push(prepare.loadIIFE(boot.jsListRoot + '/' + x));
        });
    }
    return Promise.all(promises);
}

// Load all custom script bundles. Every bundle may contain one or more named registered SystemJS modules, with no module.
function loadScriptPackages(scriptPackages) {
    var loadBundlePromises = [];
    if (scriptPackages) {
        for (var iScriptPackage = 0; iScriptPackage < scriptPackages.length; ++iScriptPackage) {
            loadBundlePromises.push(prepare.loadIIFE(scriptPackages[iScriptPackage]));
        }
    }
    return Promise.all(loadBundlePromises);
}

var prepare = function() {
    settings = window._CCSettings;
    return Promise.resolve(prepare.engine ? prepare.engine() : void 0).then(function() {
            return (boot.systemGlobal || System).import('cc');
        }).then(function() {
            var options = initOptions();
            return new Promise(function (resolve, reject) {
                let inited = cc.game.init(options);
                inited ? resolve() : reject();
            });
        }).then(function() {
            return loadScriptPackages(settings.scriptPackages);
        });
};

// Define how to prepare engine so that 'cc' is valid to import.
prepare.engine = void 0;
// Define how to prepare IIFE modules.
prepare.loadIIFE = void 0;
// Adapter: find canvas
prepare.findCanvas = void 0;
// The root url from which we can load js list.
boot.jsListRoot = 'src';
// System JS global. Default to `globalThis.System`.
boot.systemGlobal = undefined;
boot.prepare = prepare;


