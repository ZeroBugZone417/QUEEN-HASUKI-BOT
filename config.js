const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "WxpwFSjB#PI61VPAAwUiT6oydk8De7by_v4GFwOasZPQUcW9tZos",
ALIVE_IMG: process.env.ALIVE_IMG || "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/LOGO.png?raw=true",
BOT_OWNER: '94769983151',  // Replace with the owner's phone number



};
