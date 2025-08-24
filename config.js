const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "H55ilAbI#cQvGoReuJKScfynlsY_x9ck549aIBedLMUfC-Un65qM",
ALIVE_IMG: process.env.ALIVE_IMG || "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/LOGO.png?raw=true",
ALIVE_MSG: process.env.ALIVE_MSG || "*💥 Bot Status: ONLINE ✅*",
BOT_OWNER: '94769983151',  // Replace with the owner's phone number



};
