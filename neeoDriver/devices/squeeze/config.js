//-------------------------------------------
// Config initialization
//-------------------------------------------
let config = {};
config.lms = {};
config.squeeze = {};

// Set the IP address of LMS
config.lms.ipAddress = '10.0.0.140';
// Set the TCP/IP Port of LMS
config.lms.port = 9000;
// Set the Telnet Port of LMS
config.lms.portTelnet = 9090;

// Set Favorites
config.squeeze.favorites = [
{
	name : 'Rock Antenne'
}];

//-------------------------------------------
module.exports = config;