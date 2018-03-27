'use strict';

//const {kodiDevice} = require('./kodi/kodiDevice');
const {squeezeDevice} = require('./squeeze/squeezeDevice');

const loadDevices = async () => {
	let dev = [
		//kodiDevice.neeoDevice,
		squeezeDevice
	];

	return dev;
}

module.exports = loadDevices;
