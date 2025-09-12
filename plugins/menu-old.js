const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu",
    desc: "Main bot menu",
    category: "menu",
    react: "⚡",
    filename: __filename
}, 
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        // Check image URL
        if (!config.MENU_IMAGE_URL) {
            console.log("⚠️ MENU_IMAGE_URL is not set in config.");
        }

        let caption = `
👋 Hey *${pushname}*,

╭━━━〔 *${config.BOT_NAME} Menu* 〕━━━╮
┃ 👑 Owner: ${config.OWNER_NAME}
┃ ⚙️ Mode : ${config.MODE}
┃ ⌨️ Prefix : ${config.PREFIX}
┃ 🧾 Version : 3.0.0 Beta
╰━━━━━━━━━━━━━━━━━━━━╯

📌 Choose a category below 👇
`;

        // Define buttons
        let buttons = [
            { buttonId: "mainmenu", buttonText: { displayText: "🏠 Main Menu" }, type: 1 },
            { buttonId: "dlmenu", buttonText: { displayText: "⬇️ Download Menu" }, type: 1 },
            { buttonId: "groupmenu", buttonText: { displayText: "👥 Group Menu" }, type: 1 },
            { buttonId: "funmenu", buttonText: { displayText: "🎉 Fun Menu" }, type: 1 },
            { buttonId: "animemenu", buttonText: { displayText: "🎭 Anime Menu" }, type: 1 },
            { buttonId: "aimenu", buttonText: { displayText: "🤖 AI Menu" }, type: 1 },
            { buttonId: "othermenu", buttonText: { displayText: "🧩 Other Menu" }, type: 1 },
            { buttonId: "ownermenu", buttonText: { displayText: "👑 Owner Menu" }, type: 1 }
        ];

        // Build button message
        let buttonMessage = {
            image: { url: config.MENU_IMAGE_URL }, // Must be a valid URL
            caption: caption,
            footer: `© Powered by ${config.BOT_NAME}`,
            buttons: buttons,
            headerType: 4 // Image header
        };

        // Send message
        await conn.sendMessage(from, buttonMessage, { quoted: mek });

    } catch (e) {
        console.error("Menu Error:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});
