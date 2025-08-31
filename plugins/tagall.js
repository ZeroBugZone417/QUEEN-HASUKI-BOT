const { cmd } = require("../command");

cmd(
  {
    pattern: "tagall",
    alias: ["all", "mentionall"],
    react: "📢",
    desc: "Tag all group members",
    category: "group",
    filename: __filename,
  },
  async (bot, mek, m, { from, reply, isGroup, q, sender }) => {
    try {
      if (!isGroup) return reply("❌ *This command only works in groups!*");

      const metadata = await bot.groupMetadata(from);
      const participants = metadata.participants;

      let text = `📢 *Tagging All Members*\n\n`;
      if (q) text += `💬 Message: ${q}\n\n`;

      const mentions = [];
      for (let mem of participants) {
        text += `➡️ @${mem.id.split("@")[0]}\n`;
        mentions.push(mem.id);
      }

      await bot.sendMessage(
        from,
        { text, mentions },
        { quoted: mek }
      );

    } catch (e) {
      console.error("TagAll Error:", e);
      reply(`❗ *Error:* ${e.message || e}`);
    }
  }
);
