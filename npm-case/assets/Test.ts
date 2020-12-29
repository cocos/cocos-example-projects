
// Engine index module
import { log } from 'cc';

// Engine env module
import * as ccEnv from 'cc/env';

// NPM package
import protobufjs from 'protobufjs';

// Modules out of assets dir(non-project-modules)
// Note the extension is required.
import Awesome from '../Proto.js/awesome.js';

log(ccEnv);
log(protobufjs);
log(Awesome.awesome.AwesomeMessage);
