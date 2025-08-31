const { cmd } = require("../command");

cmd(
  {
    pattern: "kick",
    react: "👢",
    desc: "Kick a member (Owner only)",
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

      let user;

      // 1. If mentioned
      if (mek.message.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
        user = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
      }
      // 2. If replied
      else if (mek.message.extendedTextMessage?.contextInfo?.participant) {
        user = mek.message.extendedTextMessage.contextInfo.participant;
      }
      // 3. If number provided
      else if (q) {
        user = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
      } else {
        return reply("⚠️ *Reply, Tag or Enter a number to kick!*");
      }

      // Prevent kicking owner or bot itself
      if (user === groupOwner) return reply("❌ You cannot kick the group owner!");
      if (user === bot.user.id) return reply("❌ I can't kick myself!");

      await bot.groupParticipantsUpdate(from, [user], "remove");
      reply(`✅ Removed: @${user.split("@")[0]}`, { mentions: [user] });

    } catch (e) {
      console.error("Kick Error:", e);
      reply(`❗ *Error:* ${e.message || e}`);
    }
  }
);
