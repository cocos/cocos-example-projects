const fs = require('fs');
const ps = require('path');
const file = ps.join(__dirname, '..', 'Proto.js', 'proto.d.ts');
const original = fs.readFileSync(file, { encoding: 'utf8' });
fs.writeFileSync(file, `
namespace proto {
    ${original}
}
export default proto;
`);