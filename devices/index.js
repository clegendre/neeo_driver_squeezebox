'use strict';
//test
const adapter = require('./driver/adapter');

console.log('NEEO SDK "Squeezebox" adapter');
console.log('---------------------------------------------');

// TODO: does this can be a Promise ?
module.exports = {
    devices: adapter.discoverAndBuildDevices()
}
// adapter.discoverAndBuildDevices( devices => brain.startDriver( devices ));