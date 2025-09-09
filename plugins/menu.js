const config = require('../config');
const { cmd } = require('../command');
const os = require("os");

const { runtime } = require('../lib/functions');

cmd({
    pattern: "menu2",
    alias: ["allmenu","fullmenu"],
    use: '.menu2',
    desc: "Show all bot commands",
    category: "menu",
    react: "📜",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        let dec = `╭━━〔 🚀 *${config.BOT_NAME}* 〕━━┈⊷
┃◈╭─────────────────·๏
┃◈┃• 👑 Owner : *${config.OWNER_NAME}*
┃◈┃• ⚙️ Prefix : *[${config.PREFIX}]* 
┃◈┃• 🌐 Platform : *Heroku*
┃◈┃• 📦 Version : *${config.VERSION}*
┃◈┃• ⏱️ Runtime : *${runtime(process.uptime())}*
┃◈╰─────────────────┈⊷
╰━━━━━━━━━━━━━━━━━━━┈⊷

> ${config.DESCRIPTION}`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/QUEEN%20HASUKI.png?raw=true' },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e}`);
    }
});
