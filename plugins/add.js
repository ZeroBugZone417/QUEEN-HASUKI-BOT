const { cmd } = require("../command");

cmd(
  {
    pattern: "add",
    react: "➕",
    desc: "Add a member (Owner only)",
    category: "group",
    filename: __filename,
  },
  async (bot, mek, m, { from, reply, isGroup, q, sender }) => {
    try {
      if (!isGroup) return reply("❌ *This command only works in groups!*");

      const metadata = await bot.groupMetadata(from);
      const groupOwner = metadata.owner || metadata.participants.find(p => p.admin === "superadmin")?.id;

      if (sender !== groupOwner) {
        return reply("⚠️ *Only the group owner can use this command!*");
      }

      let number;

      // 1. If number is typed
      if (q) {
        number = q.replace(/[^0-9]/g, "");
      }
      // 2. If replied message contains number
      else if (mek.message.extendedTextMessage?.contextInfo?.quotedMessage?.conversation) {
        number = mek.message.extendedTextMessage.contextInfo.quotedMessage.conversation.replace(/[^0-9]/g, "");
      } else {
        return reply("⚠️ *Reply with a number or type a number to add!*");
      }

      if (!number) return reply("❌ *Invalid number!*");

      const userJid = number + "@s.whatsapp.net";

      // Prevent adding bot or owner (already in group)
      if (userJid === groupOwner) return reply("⚠️ This number is already the group owner!");
      if (userJid === bot.user.id) return reply("⚠️ I am already in the group!");

      await bot.groupParticipantsUpdate(from, [userJid], "add");
      reply(`✅ Added: @${number}`, { mentions: [userJid] });

    } catch (e) {
      console.error("Add Error:", e);
      reply(`❗ *Error:* ${e.message || e}`);
    }
  }
);
