// commands/alive.js
const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');
const moment = require("moment-timezone");

cmd({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Check if the bot is alive",
    category: "main",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Safe fallbacks
        const aliveText = config.ALIVE_TEXT || "Bot is Active & Online!";
        const botName = config.BOT_NAME || "QUEEN HASUKI BOT";
        const ownerName = config.OWNER_NAME || "Unknown";
        const version = "4.0.0";
        const prefix = config.PREFIX || "!";
        const mode = config.MODE || "Unknown";
        const description = config.DESCRIPTION || "Bot is running perfectly!";
        const imageUrl = config.ALIVE_IMG || "https://i.ibb.co/Y46jgcpL/2289.jpg";

        // Extra info
        const user = m.pushName || "User";
        const time = moment().tz("Asia/Colombo").format("YYYY-MM-DD HH:mm:ss");

        // Status message
        const status = ` ╭───〔 *🤖 ${botName} STATUS* 〕───◉
 │🙋 *User:* ${user}
 │✨ *${aliveText}*
 │🧠 *Owner:* ${ownerName}
 │⚡ *Version:* ${version}
 │📝 *Prefix:* [${prefix}]
 │📳 *Mode:* [${mode}]
 │🖥️ *Host:* ${os.hostname()}
 │⌛ *Uptime:* ${runtime(process.uptime())}
 │⏰ *Time:* ${time}
 ╰────────────────────◉
 > ${description}`;

        // Send alive message
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1000,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`❌ An error occurred: ${e.message || e}`);
    }
});
