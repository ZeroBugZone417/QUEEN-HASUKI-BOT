const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "ping",
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const startTime = Date.now();
        const { key } = await conn.sendMessage(from, { text: '⚡ *Pinging...*' });
        const endTime = Date.now();
        const ping = endTime - startTime;

        const stages = [
            '🔄 *Initializing Ping...*',
            '⚡ ʟᴏᴀᴅɪɴɢ 《 ▭▭▭▭▭▭▭▭▭▭ 》0%',
            '⚡ ʟᴏᴀᴅɪɴɢ 《 ▬▭▭▭▭▭▭▭▭▭ 》10%',
            '⚡ ʟᴏᴀᴅɪɴɢ 《 ▬▬▭▭▭▭▭▭▭▭ 》20%',
            '⚡ ʟᴏᴀᴅɪɴɢ 《 ▬▬▬▭▭▭▭▭▭▭ 》30%',
            '⚡ ʟᴏᴀᴅɪɴɢ 《 ▬▬▬▬▭▭▭▭▭▭ 》40%',
            '⚡ ʟᴏᴀᴅɪɴɢ 《 ▬▬▬▬▬▭▭▭▭▭ 》50%',
            '⚡ ʟᴏᴀᴅɪɴɢ 《 ▬▬▬▬▬▬▭▭▭▭ 》60%',
            '⚡ ʟᴏᴀᴅɪɴɢ 《 ▬▬▬▬▬▬▬▭▭▭ 》70%',
            '⚡ ʟᴏᴀᴅɪɴɢ 《 ▬▬▬▬▬▬▬▬▭▭ 》80%',
            '⚡ ʟᴏᴀᴅɪɴɢ 《 ▬▬▬▬▬▬▬▬▬▭ 》90%',
            '✅ *Ping Complete!*',
            `📡 𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐒𝐩𝐞𝐞𝐝: *${ping}ms* 🚀`,
        ];

        for (let i = 0; i < stages.length; i++) {
            await conn.relayMessage(
                from,
                {
                    protocolMessage: {
                        key: key,
                        type: 14,
                        editedMessage: {
                            conversation: stages[i],
                        },
                    },
                },
                {}
            );
            await new Promise(res => setTimeout(res, 500)); // smooth effect
        }

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
