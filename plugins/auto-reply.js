const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    on: "body", // triggers on any text message
}, async (conn, mek, m, { from, body, isOwner }) => {
    try {
        // Load auto-reply JSON file from lib folder
        const filePath = path.join(__dirname, '../lib/autoreply.json');
        if (!fs.existsSync(filePath)) return;

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Normalize incoming message
        const userMsg = body?.toLowerCase().trim() || "";

        for (const trigger in data) {
            const triggerText = trigger.toLowerCase().trim();
            // Partial match: check if user message includes trigger text
            if (userMsg.includes(triggerText)) {
                if (config.AUTO_REPLY === 'true') {
                    // Optionally skip owner messages
                    // if (isOwner) return;

                    // Send reply
                    await m.reply(data[trigger]);
                    break; // reply once per message
                }
            }
        }
    } catch (err) {
        console.error("Auto-reply Error:", err);
    }
});
