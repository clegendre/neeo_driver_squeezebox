'use strict';

const path = require('path');
const fs = require('fs');
const dirname = __dirname;

module.exports = function() {
    try {
        return JSON.parse(fs.readFileSync(path.join(dirname, '../setting.json')));
    }
    catch (err) {
        throw err;
    }
}