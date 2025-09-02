const { cmd } = require("../command");

cmd(
  {
    pattern: "add",
    react: "➕",
    desc: "Add a member to the group",
    category: "group",
    filename: __filename,
    fromMe: true, // only bot owner or admin can use
  },
  async (malvin, mek, m, { text, reply }) => {
    try {
      const from = mek.key.remoteJid;

      // Check if text is provided
      if (!text) {
        return reply("❌ Usage: .add <number>\nExample: .add 9477xxxxxxx");
      }

      // Convert number to WhatsApp ID
      let jid = text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

      // Add member
      await malvin.groupParticipantsUpdate(from, [jid], "add");

      await reply(`✅ Successfully added: @${jid.split("@")[0]}`, {
        mentions: [jid],
      });
    } catch (e) {
      console.error("❌ Error in .add command:", e);
      reply("❌ Failed to add member. Make sure the bot is admin in this group.");
    }
  }
);
