const { cmd } = require("../command");

cmd(
  {
    pattern: "unmute",
    react: "🔓",
    desc: "Unmute the group (Admins/Owner only)",
    category: "group",
    filename: __filename,
  },
  async (bot, mek, m, { from, reply, isGroup, sender }) => {
    try {
      if (!isGroup) return reply("❌ *This command only works in groups!*");

      const metadata = await bot.groupMetadata(from);
      const participants = metadata.participants;

      // check admins + owner
      const admins = participants.filter(p => p.admin).map(p => p.id);
      const groupOwner = metadata.owner || admins.find(id => id.admin === "superadmin")?.id;

      if (!(admins.includes(sender) || sender === groupOwner)) {
        return reply("⚠️ *Only admins or the group owner can use this command!*");
      }

      await bot.groupSettingUpdate(from, "not_announcement"); // all members can send
      reply("🔓 *Group has been unmuted (everyone can send messages)*");

    } catch (e) {
      console.error("Unmute Error:", e);
      reply(`❗ *Error:* ${e.message || e}`);
    }
  }
);
