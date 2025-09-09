const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "OpZSlTzR#Dz_3dxcmSdnjXndSRiByeqYXMUYmrhFARSk9ncIy3Tc",
ALIVE_IMG: process.env.ALIVE_IMG || "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/QUEEN%20HASUKI.png?raw=true",
BOT_OWNER: '94769983151',  // Replace with the owner's phone number



};
