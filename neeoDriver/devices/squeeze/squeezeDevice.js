const neeoapi = require('neeo-sdk');
const config = require('./config');
const SqueezeServer = require('./server');

const lms = new SqueezeServer(config.lms.ipAddress, config.lms.port, config.lms.portTelnet);

let updateCallbackReference;
const newSongCallback = async (deviceId) =>{
	let songInfo = await lms.getSongInfo(deviceId);
	if (updateCallbackReference) {
		updateCallbackReference({
			uniqueDeviceId: deviceId,
			component: 'label-artist',
			value: songInfo.artist
		});
		updateCallbackReference({
			uniqueDeviceId: deviceId,
			component: 'label-title',
			value: songInfo.title
		});
		updateCallbackReference({
			uniqueDeviceId: deviceId,
			component: 'label-album',
			value: songInfo.album
		});
		updateCallbackReference({
			uniqueDeviceId: deviceId,
			component: 'albumcover',
			value: songInfo.url
		});
	}
}

lms.setNewSongCallback(newSongCallback);

const controllerWithDiscovery = {
	getPowerState: async function getPowerState(deviceId) {
		return await lms.getPowerState(deviceId);
	},
	onButtonPressed: async function onButtonPressed(name, deviceId) {
		try{
			DebugLog(`${name} button pressed on ${deviceId}`);
			switch(name)
			{
				case 'POWER ON':
					lms.powerOn(deviceId);
					break;
				case 'POWER OFF':
					lms.powerOff(deviceId);
					break;
				case 'PLAY':
					lms.play(deviceId);
					break;
				case 'PAUSE':
					lms.pause(deviceId);
					break;
				case 'STOP':
					lms.stop(deviceId);
					break;
				case 'PREVIOUS':
				case 'CHANNEL DOWN':
					lms.previous(deviceId);
					break;
				case 'NEXT':
				case 'CHANNEL UP':
					lms.next(deviceId);
					break;
				case 'MUTE TOGGLE':
					lms.toggleMute(deviceId);
					break;
				case 'VOLUME UP':
					let volumeUp = await lms.getVolume(deviceId);
					volumeUp++;
					if(volumeUp <= 100)
						lms.setVolume(deviceId, volumeUp);
					break;
				case 'VOLUME DOWN':
					let volumeDown = await lms.getVolume(deviceId);
					volumeDown--;
					if(volumeDown >= 0)
						lms.setVolume(deviceId, volumeDown);
					break;
				case 'RANDOM TRACK':
					lms.playRandomTrack(deviceId);
					break;
				case 'RANDOM ALBUM':
					lms.playRandomAlbum(deviceId);
					break;
				default:
					if(config.squeeze.favorites.find((fav) => fav.name === name))
					{
						lms.playFavorite(deviceId, name);
					}
			}
		}
		catch(err)
		{
			DebugLog(`ButtonHanlder-Error: ${err}`);
		}
	},
	getCurrentTitle: async function getCurrentTitle(deviceId) {
		return await lms.getTitle(deviceId);
	},
	getCurrentArtist: async function getCurrentArtist(deviceId) {
		return await lms.getArtist(deviceId);
	},
	getCurrentAlbum: async function getCurrentAlbum(deviceId) {
		return await lms.getAlbum(deviceId);
	},
	getCurrentAlbumCoverUri: async function getCurrentAlbumCoverUri(deviceId) {
		let res = await lms.getSongInfo(deviceId);
		DebugLog(res.url);
		return res.url;
	},
	discoverConectedPlayers: async function discoverConectedPlayers() {
		let players = [];
		try
		{
			lmsPlayers = await lms.getConnectedPlayers();
			lmsPlayers.forEach(player => {
				players.push({
					id: player.playerid,
					name: player.name,
					reachable: player.connected,
				});
			});
			DebugLog(`Discovered players ${JSON.stringify(players)}`);
		}
		catch(e)
		{
			DebugLog(`No players found`);
		}
		return players;
	}
}

var squeezeDevice = neeoapi.buildDevice('LMS')
	.setManufacturer('Logitech')
	.setType('AUDIO')

	.addPowerStateSensor( { getter: controllerWithDiscovery.getPowerState})
	.addButtonGroup('POWER')
	.addButtonGroup('TRANSPORT')
	.addButtonGroup('TRANSPORT SCAN')
	.addButtonGroup('VOLUME')
	.addButton({
		name: 'RANDOM TRACK',
		label: 'Play random track'
	})
	.addButton({
		name: 'RANDOM ALBUM',
		label: 'Play random album'
	})
	.addButtonHandler(controllerWithDiscovery.onButtonPressed)
	.addTextLabel({
		name: 'label-title',
		label: 'Title'
	}, controllerWithDiscovery.getCurrentTitle)
	.addTextLabel({
		name: 'label-artist',
		label: 'Artist'
	}, controllerWithDiscovery.getCurrentArtist)
	.addTextLabel({
		name: 'label-album',
		label: 'Album'
	}, controllerWithDiscovery.getCurrentAlbum)
	.addImageUrl({
		name: 'albumcover',
		size: 'large'
	}, controllerWithDiscovery.getCurrentAlbumCoverUri)
	.registerSubscriptionFunction((updateCallback) => {
		updateCallbackReference = updateCallback;
	})
	  

	.enableDiscovery({
		headerText: 'Add network players you want to control',
		description: 'The players have to be switched on'
	}, controllerWithDiscovery.discoverConectedPlayers);

config.squeeze.favorites.forEach( fav => squeezeDevice.addButton({
	name: fav.name,
	label: fav.name
}));

const DebugLog = (output) => {
	console.log("SqueezeDriver: " + output);
}

module.exports = {
	squeezeDevice
}