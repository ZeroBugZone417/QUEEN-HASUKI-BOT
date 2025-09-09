// config.js
const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || "zopDjA4T#G4FNOJWen9Cj79R_7BXVTYvq135Wv7bDF8m_1biWpJs",
    ALIVE_IMG: process.env.ALIVE_IMG || "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/QUEEN%20HASUKI.png?raw=true",
    BOT_OWNER: process.env.BOT_OWNER || '94769983151',
    BOT_NAME: process.env.BOT_NAME || "Queen Hasuki",
    OWNER_NAME: process.env.OWNER_NAME || "Dineth Sudarshana",
    PREFIX: process.env.PREFIX || ".",
    MODE: process.env.MODE || "Public",
    DESCRIPTION: process.env.DESCRIPTION || "Your friendly WhatsApp bot",
    VERSION: process.env.VERSION || "1.0.0", // <--- Add version here
    MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/QUEEN%20HASUKI.png?raw=true"
};
