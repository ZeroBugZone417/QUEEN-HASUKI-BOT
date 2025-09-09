const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Check bot is alive or not",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const BOT_NAME = config.BOT_NAME || 'Queen Hasuki';
        const OWNER_NAME = config.OWNER_NAME || 'Unknown';
        const VERSION = config.VERSION || '4.0.0';
        const PREFIX = config.PREFIX || '.';
        const MODE = config.MODE || 'Default';
        const DESCRIPTION = config.DESCRIPTION || 'Bot is online!';

        const statusText = `
╭───〔 *🤖 ${BOT_NAME} STATUS* 〕───◉
│✨ *Bot is Active & Online!*
│
│🧠 *Owner:* ${OWNER_NAME}
│⚡ *Version:* ${VERSION}
│📝 *Prefix:* [${PREFIX}]
│📳 *Mode:* [${MODE}]
╰────────────────────◉
> ${DESCRIPTION}
        `.trim();

        const MENU_IMAGE_URL = config.MENU_IMAGE_URL || 'https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/QUEEN%20HASUKI.png?raw=true';

        await conn.sendMessage(
            from,
            {
                image: { url: MENU_IMAGE_URL },
                caption: statusText,
                contextInfo: {
                    mentionedJid: [m?.sender || from],
                    forwardingScore: 1000,
                    isForwarded: true
                }
            },
            { quoted: mek || {} }
        );

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`❌ Error: ${e.message || e}`);
    }
});
