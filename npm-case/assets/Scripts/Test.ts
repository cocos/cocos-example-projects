
// Engine index module
import { log } from 'cc';

// Engine env module
import * as ccEnv from 'cc/env';
log(ccEnv);

// Import from module written in TypeScript, the extension should be omitted.
import * as extensionLess from './dir/index';
log(extensionLess.obj.value);

// Import from module written in TypeScript, the "directory import" is supported.
import * as directoryImport from './dir';
log(directoryImport.obj === extensionLess.obj);

// NPM package
import protobufjs from 'protobufjs';
log(protobufjs);

// NPM package subpath
// Note the extension is required.
// @ts-expect-error: have no .d.ts for this module
import protobufjsUtils from 'protobufjs/src/util.js';
log(protobufjsUtils);

// Modules out of assets dir(non-project-modules)
// Note the extension is required.
import Awesome from '../../Proto.js/awesome.js';
log(Awesome.awesome.AwesomeMessage);

// Toggle "Enable Guess CommonJS exports"
// This is amazing. The `@protobufjs/float/index.js` is in CommonJS but Creator deduced the exports.
// TRY TO AVOID THIS and simply use "import default" form.
// import protobufjsFloatIndex from '@protobufjs/float/index.js';
// import { writeDoubleBE } from '@protobufjs/float/index.js';
// log(`Guess exports: ${protobufjsFloatIndex.writeDoubleBE === writeDoubleBE}`);
