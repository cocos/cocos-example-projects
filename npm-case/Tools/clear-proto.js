
const fs = require('fs-extra');
const ps = require('path');

(async () => {
    await fs.emptyDir(ps.join(__dirname, '..', 'Proto.js'));
})();
