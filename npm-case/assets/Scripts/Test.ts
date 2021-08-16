
import chai from 'chai';

chai.config.includeStack = true;

// Module `'cc'`
import { log } from 'cc';
chai.expect(typeof log).to.equal('function');

// Module `'cc/env'`
import * as ccEnv from 'cc/env';
chai.expect(typeof ccEnv).to.equal('object');

// Import from module written in TypeScript, the extension should be omitted.
import * as extensionLess from './dir/index';
// Import from module written in TypeScript, the "directory import" is supported.
import * as directoryImport from './dir';
chai.expect(extensionLess.obj.value).to.equal('dir/index');
chai.expect(extensionLess === directoryImport);

// Node.js package
import protobufjs from 'protobufjs';
chai.expect(typeof protobufjs).to.equal('object');

// Node.js package subpath
// Note the extension is required.
// @ts-expect-error: have no .d.ts for this module
import protobufjsUtils from 'protobufjs/src/util.js';
chai.expect(typeof protobufjsUtils).to.equal('object');

// Scoped Node.js package
import protobufTsRuntime from '@protobuf-ts/runtime';
chai.expect(typeof protobufTsRuntime.base64decode).to.equal('function');

// Another Node.js package
import jsZip from 'jszip/dist/jszip.min.js';
chai.expect(jsZip.version).to.equal('3.5.0');

// Another Node.js package
import colyseus from 'colyseus.js';
chai.expect(typeof colyseus.Protocol).to.equal('object');

// import { hideBin } from 'yargs/helpers'
// chai.expect(typeof hideBin).to.equal('string');

// Modules out of assets dir(non-project-modules)
// Note the extension is required.
import proto from '../../Proto.js/proto.js';
chai.expect(typeof proto.Foo).to.equal('function');
chai.expect(typeof proto.pkg1.Bar).to.equal('function');
chai.expect(typeof proto.pkg2.Baz).to.equal('function');

// Toggle "Enable Guess CommonJS exports"
// This is amazing. The `@protobufjs/float/index.js` is in CommonJS but Creator deduced the exports.
// TRY TO AVOID THIS and simply use "import default" form.
// import protobufjsFloatIndex from '@protobufjs/float/index.js';
// import { writeDoubleBE } from '@protobufjs/float/index.js';
// log(`Guess exports: ${protobufjsFloatIndex.writeDoubleBE === writeDoubleBE}`);

// MGOBE is not a namespace, from its declaration file
import '../../Libs/MGOBE_v1.3.8/MGOBE.js';
chai.expect(typeof MGOBE).to.equal('function');
chai.expect(typeof MGOBE.Room).to.equal('function');
