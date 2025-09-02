// lib/antilink.js

const fs = require('fs');
const { jidNormalizedUser } = require('@whiskeysockets/baileys');

const warnFile = './lib/warnings.json';

// Load warnings from JSON
function loadWarnings() {
    if (!fs.existsSync(warnFile)) {
        fs.writeFileSync(warnFile, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(warnFile));
}

// Save warnings to JSON
function saveWarnings(data) {
    fs.writeFileSync(warnFile, JSON.stringify(data, null, 2));
}

module.exports = async (msg, conn) => {
    try {
        if (!msg.message || !msg.key.remoteJid.endsWith('@g.us')) return;

        const from = msg.key.remoteJid;
        const sender = jidNormalizedUser(msg.key.participant || msg.key.remoteJid);
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (!body) return;

        // Regex detect WhatsApp links
        const linkRegex = /(https?:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+)/gi;
        const isLink = linkRegex.test(body);

        if (isLink) {
            const metadata = await conn.groupMetadata(from);
            const admins = metadata.participants.filter(p => p.admin).map(p => p.id);

            if (admins.includes(sender)) {
                console.log("Admin posted a link - ignored");
                return;
            }

            // Delete the message
            await conn.sendMessage(from, { delete: msg.key });

            // Load warn list
            let warnings = loadWarnings();
            if (!warnings[from]) warnings[from] = {};
            if (!warnings[from][sender]) warnings[from][sender] = 0;

            warnings[from][sender] += 1;
            saveWarnings(warnings);

            let warnCount = warnings[from][sender];

            if (warnCount < 3) {
                // Warn message
                await conn.sendMessage(from, {
                    text: `⚠️ *Anti-Link Detected!*\n@${sender.split('@')[0]}, links are not allowed!\n\nWarning: *${warnCount}/3*`,
                    mentions: [sender]
                });
            } else {
                // Kick user
                await conn.sendMessage(from, {
                    text: `🚫 @${sender.split('@')[0]} removed for posting links 3 times.`,
                    mentions: [sender]
                });

                await conn.groupParticipantsUpdate(from, [sender], "remove");

                // Reset warnings after kick
                warnings[from][sender] = 0;
                saveWarnings(warnings);
            }
        }
    } catch (e) {
        console.error("Anti-link error:", e);
    }
};
