const { cmd } = require("../command");

cmd(
  {
    pattern: "grouplink",
    react: "🔗",
    desc: "Get the group invite link (Admins/Owner only)",
    category: "group",
    filename: __filename,
  },
  async (bot, mek, m, { from, reply, isGroup, sender }) => {
    try {
      if (!isGroup) return reply("❌ *This command only works in groups!*");

      const metadata = await bot.groupMetadata(from);
      const participants = metadata.participants;

      // find admins + owner
      const admins = participants.filter(p => p.admin).map(p => p.id);
      const groupOwner = metadata.owner || admins.find(p => p.admin === "superadmin")?.id;

      if (!(admins.includes(sender) || sender === groupOwner)) {
        return reply("⚠️ *Only admins or the group owner can use this command!*");
      }

      const inviteCode = await bot.groupInviteCode(from);
      const groupLink = `https://chat.whatsapp.com/${inviteCode}`;

      reply(
        `╔══✦•❀•✦══╗
🔗 *GROUP INVITE LINK*
╚══✦•❀•✦══╝

📌 *Group:* ${metadata.subject}
👑 *Owner:* ${groupOwner ? "@" + groupOwner.split("@")[0] : "Unknown"}
🔗 *Link:* ${groupLink}`
      );

    } catch (e) {
      console.error("GroupLink Error:", e);
      reply(`❗ *Error:* ${e.message || e}`);
    }
  }
);
