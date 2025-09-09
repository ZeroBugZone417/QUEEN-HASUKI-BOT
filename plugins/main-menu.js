const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "cmd",
    alias: ["allmenu", "fullmenu"],
    use: '.menu2',
    desc: "Show all bot commands",
    category: "menu",
    react: "📜",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        // Get all commands grouped by category
        const commandList = {};
        for (let c of commands) {
            if (!commandList[c.category]) commandList[c.category] = [];
            commandList[c.category].push(c.pattern);
        }

        // Build the menu text
        let menuText = `╭━━〔 🚀 *${config.BOT_NAME}* 〕━━┈⊷
┃◈ Owner: *${config.OWNER_NAME}*
┃◈ Prefix: *[${config.PREFIX}]*
┃◈ Runtime: *${runtime(process.uptime())}*
╰━━━━━━━━━━━━━━━━━━━┈⊷\n`;

        for (let category in commandList) {
            menuText += `\n╭━━〔 ${category.toUpperCase()} 〕━━┈⊷\n`;
            for (let cmdName of commandList[category]) {
                menuText += `┃• ${cmdName}\n`;
            }
            menuText += '╰━━━━━━━━━━━━━━━━━━━┈⊷\n';
        }

        menuText += `\n> ${config.DESCRIPTION}`;

        await reply(menuText);

    } catch (e) {
        console.log('Menu2 command error:', e);
        reply(`❌ Error: ${e.message || e}`);
    }
});
