const neeoapi = require('neeo-sdk');
const settings = require('./settings')();
const controller = require('./controller');
const SqueezeServer = require('../squeeze/server');

function discoverPlayers(){
    return new Promise( (resolve, reject) => {
        const server = new SqueezeServer( settings.server.host, settings.server.port);
        server.on('register', function(){
            server.getPlayers( function(reply) {
                if( reply.ok) {
                    if( settings.squeeze.loadAllPlayers) {
                        resolve( server.players )
                    } else {
                        const playersToLoad = {};
                        settings.squeeze.players.forEach( p => {
                            playersToLoad[p] = server.players[p];
                        });
                        resolve( playersToLoad );
                    }
                }
            });
        })
    }); 
}
  
/**
 * @function buildDevice
 * @param {SqueezePlayer} player An instance of a discovered SqueezeBox player
 * @description  A basic adapter to control a logitech squeezebox. It looks for favorites and spotify playlist and add them as shortcuts.
 * @returns A promise that sould redolve with the device built.
 */
function buildDevice( player ){
    let device = neeoapi.buildDevice( player.name )
        .setManufacturer('Logitech')
        .setType('AUDIO');

    let builder = controller.build( device, player )
        .addDefaultButtonHandler()
        .addBasicActions()
        .addVolumeActions()
        .addNavigationButtons()
        .addButton('Random Album', () => player.playRandom('albums'))
        .addButton('Random Track', () => player.playRandom('track'))
        .addFavorites( settings.squeeze.favorites )
        .addSpotify( settings.squeeze.spotify )
        .addDurationSlider( 'Duration')
        .addTrackLabels({ artistLabel:'Artist', albumLabel: 'Album', titleLabel:'Title' })
        .addPowerStateManagement()
        .addCurrentTrackCover();

     return device;
}

  
  
/**
 * @function buildDevices Create all devices from all discovered SqueezePlayer
 * @param players All players discovered by the LMS server
 * @returns An array of devices build by the fluent neeoapi
 *  */
function buildDevices( players ){
    const allPlayers = []; 
    for( let playerId in players) {
        const player = players[playerId];
        allPlayers.push(player);
    }
    return allPlayers.map( (player, idx ) => {
        const device = buildDevice( player )
        console.log( device.devicename, device.deviceidentifier)
        return device;
    });
  }
module.exports.discoverAndBuildDevices = function(){
    return discoverPlayers().then( buildDevices )
}