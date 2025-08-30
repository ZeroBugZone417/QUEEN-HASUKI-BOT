const { cmd, commands } = require("../command");

cmd(
  {
    pattern: "menu",
    desc: "Displays all available commands",
    category: "main",
    filename: __filename,
  },
  async (
    danuwa,
    mek,
    m,
    {
      from,
      reply
    }
  ) => {
    try {
      const categories = {};

      // Group commands by categories
      for (let cmdName in commands) {
        const cmdData = commands[cmdName];
        const cat = cmdData.category?.toLowerCase() || "other";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({
          pattern: cmdData.pattern,
          desc: cmdData.desc || "No description"
        });
      }

      let menuText = "📋 *✦════•❁ QUEEN HASUKI V1 ❁•════✦:*\n\n";

      // Loop through categories and list commands
      for (const [cat, cmds] of Object.entries(categories)) {
        menuText += `🔹 *${cat.toUpperCase()}*\n`;
        cmds.forEach(c => {
          menuText += `⚙️ *${c.pattern}* ➤ ${c.desc}\n`;
        });
        menuText += "\n" + "✂️".repeat(25) + "\n";
      }

      // Add footer with clickable links
      menuText += `✨ *Enjoy using QUEEN HASUKI!*\n` +
                  `💬 *For help, type .help* \n` +
                  `🌐 *Join our official WhatsApp Channel:* [Click here](https://whatsapp.com/channel/0029VbA6MSYJUM2TVOzCSb2A)\n` +
                  `🔗 *Source Code:* [GitHub](https://github.com/XdKing2/QUEEN-HASUKI)\n`;

      // Send the formatted menu text
      await reply(menuText.trim());
    } catch (err) {
      console.error(err);
      reply("❌ Error generating menu.");
    }
  }
);

