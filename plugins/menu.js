const { cmd, commands } = require("../command");

cmd(
  {
    pattern: "menu",
    desc: "Displays command categories",
    category: "main",
    filename: __filename,
  },
  async (danuwa, mek, m, { from, reply }) => {
    try {
      const categories = {};
      for (let cmdName in commands) {
        const cmdData = commands[cmdName];
        const cat = cmdData.category?.toLowerCase() || "other";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({
          pattern: cmdData.pattern,
          desc: cmdData.desc || "No description",
        });
      }

      let menuText = `*🎉 HASUKI BOT MENU 🎉*\n\n`;

      for (let cat in categories) {
        menuText += `*📂 ${cat.toUpperCase()}*\n`;
        categories[cat].forEach((c, i) => {
          menuText += `➤ *${c.pattern}* — _${c.desc}_\n`;
        });
        menuText += "\n"; // space between categories
      }

      menuText += `*👤 Owner Contact*\n📱 wa.me/94769983151\n\n`;
      menuText += `*🛡 Zero Bug Zone*\n`;

      await danuwa.sendMessage(from, { text: menuText }, { quoted: mek });
    } catch (err) {
      console.error(err);
      reply("❌ Error generating menu.");
    }
  }
);
