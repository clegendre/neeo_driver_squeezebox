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
Edit config.js file (neeoDriver/devices/squeeze/config.js) to configure LMS ip address and port.

### Step 2
SqueezeBox Players are dynamically discovered. Search for the device "LMS", choose it and then the discovered players are listed.

### STEP 3
Open player from home screen and add shortcuts:
 - Transport (Play/Stop/Pause)
 - Transport w/o Stop (Play/Pause)
 - Transport Scan (Previous/Next)
 - Play random album
 - Play random track
 - Favorites (Added in config.js / displayed as buttons)
 - Current Song:
   + Artist
   + Title
   + Album
   + Album cover
 - Directorys:
   + Current Playlist
   + Favorites
   + Music Library

### TODO/Planed Features (Currently not supported in NEEO SDK)
 + DONE Automatically add favorites
 + DONE Display playlist
 + (Sync Players)