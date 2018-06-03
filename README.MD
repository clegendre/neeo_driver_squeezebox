# NEEO driver for Logitech Media Server / Squeezebox

This is a NEEO driver for Logitech Media Server / Squeezebox.

It's a fork from https://github.com/clegendre/neeo_driver_squeezebox with many changes:

 - Restructured project for multi-driver approach --> See neeoDriver/devices/index.js
 - Async/Await for Req/Res
 - Telnet-Listener for notifications (New Song) --> Current Song info is updated when a new song is played
 - Changed Neeo "DeviceBuilding" use discovery
 - Neeo Brain is discovered automatically (not working on Windows)


## Instructions
### Step 1
Enable the “Audio” device in */node_modules/neeo-sdk/lib/device/validation/devicetype.js* to be inline with the below

``` javascript
const TYPES = [
  'ACCESSOIRE',
  'AUDIO',
  'AVRECEIVER',
  'DVB',
  'DVD',
  'GAMECONSOLE',
  'LIGHT',
  'MEDIAPLAYER',
  'PROJECTOR',
  'TV',
  'VOD'
];
```

### Step 2
Edit config.js file (neeoDriver/devices/squeeze/config.js) to configure LMS ip address and port.
You can add your favorites, they will be added as buttons.

### Step 3
SqueezeBox Players are dynamically discovered. Search for the device "LMS", choose it and then the discovered players are listed.

### STEP 4
Each player is displayed as recipe and has to be enabled to be displayed in home screen (Options/Recipes)

### STEP 5
Open player from home screen and add shortcuts:
 - Transport (Play/Stop/Pause)
 - Transport w/o Stop (Play/Pause)
 - Transport Scan (Previous/Next)
 - Play random album
 - Play random track
 - Favorites (Added in config.js)
 - Current Song:
   + Artist
   + Title
   + Album
   + Album cover

### TODO/Planed Features (Currently not supported in NEEO SDK)
 + Automatically add favorites
 + Display playlist
 + (Sync Players)