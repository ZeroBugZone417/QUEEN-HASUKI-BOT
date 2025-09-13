const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    on: "body", // triggers on any text message
}, async (conn, mek, m, { from, body, isOwner }) => {
    try {
        // Check if auto typing is enabled
        if (config.AUTO_TYPING === 'true') {
            await conn.sendPresenceUpdate('composing', from); // send typing status
        }
    } catch (err) {
        console.error("Auto-Typing Error:", err);
    }
});

