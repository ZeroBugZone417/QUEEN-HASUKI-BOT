const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "D1ZE2Z4C#i-Tng2k6kqM5mVMXYh22eMKTEfrZ7-jnCtyYDI7hVjU",
ALIVE_IMG: process.env.ALIVE_IMG || "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/LOGO.png?raw=true",
BOT_OWNER: '94769983151',  // Replace with the owner's phone number



};
