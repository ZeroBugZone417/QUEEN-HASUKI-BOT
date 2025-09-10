const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    react: "✅",
    desc: "Get owner number, info & photo preview",
    category: "main",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        const ownerNumber = config.OWNER_NUMBER.replace(/[^0-9]/g, ''); // clean number
        const ownerName = config.OWNER_NAME;
        const botName = config.BOT_NAME;
        const botImage = "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/QUEEN%20HASUKI.png?raw=true"; // your image URL

        // Build vCard
        const vcard = 
`BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
ORG:${botName}
TEL;type=CELL;type=VOICE;waid=${ownerNumber}:${ownerNumber}
END:VCARD`;

        // Owner info caption
        const caption = `
*👑 ${botName} Owner Info:*

📛 Name: ${ownerName}
📞 Number: wa.me/${ownerNumber}
🌐 Github: https://github.com/ZeroBugZone417
✨ _Powered by Zero Bug Zone_
        `.trim();

        // Send contact + preview image + caption using externalAdReply
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            },
            contextInfo: {
                externalAdReply: {
                    title: `${botName} Owner`,
                    body: "Tap to view contact details",
                    thumbnailUrl: botImage, // photo preview
                    sourceUrl: botImage,    // optional, link on preview
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            },
            text: caption
        }, { quoted: mek });

    } catch (error) {
        console.error("Owner Command Error:", error);
        reply(`❌ An error occurred: ${error.message}`);
    }
});
