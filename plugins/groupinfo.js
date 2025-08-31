const { cmd } = require("../command");

cmd(
  {
    pattern: "groupinfo",
    alias: ["ginfo"],
    react: "📊",
    desc: "Show group information",
    category: "group",
    filename: __filename,
  },
  async (bot, mek, m, { from, reply, isGroup }) => {
    try {
      if (!isGroup) return reply("❌ *This command only works in groups!*");

      const metadata = await bot.groupMetadata(from);

      const groupName = metadata.subject || "Unknown";
      const groupId = metadata.id;
      const groupOwner = metadata.owner || metadata.participants.find(p => p.admin === "superadmin")?.id || "Unknown";
      const groupDesc = metadata.desc?.toString() || "No description set";
      const totalMembers = metadata.participants.length;

      const admins = metadata.participants.filter(p => p.admin).map(p => "@" + p.id.split("@")[0]);
      const adminList = admins.length ? admins.join(", ") : "No admins";

      const text = `╔══════✦•❀•✦══════╗
📊 *GROUP INFORMATION*
╚══════✦•❀•✦══════╝

🏷️ *Name:* ${groupName}
🆔 *ID:* ${groupId}
👑 *Owner:* @${groupOwner.split("@")[0]}
👥 *Members:* ${totalMembers}
🔑 *Admins:* ${admins.length}

💬 *Description:*
${groupDesc}

✨ *Zero Bug Zone* ✨`;

      await bot.sendMessage(from, { text, mentions: [groupOwner, ...metadata.participants.map(p => p.id)] }, { quoted: mek });
    } catch (e) {
      console.error("GroupInfo Error:", e);
      reply(`❗ *Error:* ${e.message || e}`);
    }
  }
);
