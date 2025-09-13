const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "admin",
    alias: ["promote", "demote"],
    desc: "Promote/Demote mentioned or replied user (group admins only)",
    category: "group",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, sender, isBotAdmins, isGroup, reply, args, react }) => {
    try {
        // Group validation
        if (!isGroup) {
            await react("❌");
            return reply("❌ *This command can only be used in groups.*");
        }

        // Bot admin check
        if (!isBotAdmins) {
            await react("❌");
            return reply("❌ *I need admin privileges to perform this action.*");
        }

        // Group metadata for admin check
        const groupMetadata = await conn.groupMetadata(from);
        const admins = groupMetadata.participants
            .filter(p => p.admin !== null)
            .map(p => p.id);

        // Check if sender is admin
        if (!admins.includes(sender)) {
            await react("🚫");
            return reply("🚫 *Only group admins can use this command.*");
        }

        // Normalize JID helper
        const normalizeJid = (jid) => {
            if (!jid) return jid;
            return jid.includes('@') ? jid.split('@')[0] + '@s.whatsapp.net' : jid + '@s.whatsapp.net';
        };

        // Target user (from mention / reply)
        const mentioned = m.mentionedJid && m.mentionedJid.length > 0 ? m.mentionedJid[0] : null;
        const quoted = m.quoted ? m.quoted.sender : null;
        const target = normalizeJid(mentioned || quoted);

        if (!target) {
            return reply("⚠️ *Please mention or reply to a user to promote/demote.*\n\nExample:\n`.admin promote @user`\n`.admin demote @user`");
        }

        // Action (promote/demote)
        const action = (args[0] || "").toLowerCase();
        if (!["promote", "demote"].includes(action)) {
            return reply("⚠️ *Invalid action.* Use either `promote` or `demote`.\n\nExample:\n`.admin promote @user`\n`.admin demote @user`");
        }

        // Already admin check
        const targetParticipant = groupMetadata.participants.find(p => p.id === target);
        if (action === "promote" && targetParticipant?.admin) {
            return reply("ℹ️ *That user is already an admin.*");
        }
        if (action === "demote" && !targetParticipant?.admin) {
            return reply("ℹ️ *That user is not an admin.*");
        }

        // Perform action
        await conn.groupParticipantsUpdate(from, [target], action);
        await react("✅");

        return reply(
            action === "promote"
                ? `👑 *${target.split('@')[0]} is now an admin!*`
                : `⚠️ *${target.split('@')[0]} has been demoted from admin.*`
        );

    } catch (error) {
        console.error("Admin command error:", error);
        await react("❌");
        return reply("⚠️ *Failed to update admin rights.*\n\n💡 Error: " + error.message);
    }
});
