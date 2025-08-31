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
      // --- Define categories ---
      const categories = {};
      for (let cmdName in commands) {
        const cmdData = commands[cmdName];
        const cat = cmdData.category?.toLowerCase() || "other";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({
          pattern: cmdData.pattern,
          desc: cmdData.desc || "No description"
        });
      }

      // --- Build menu text ---
      let menuText = `
╔═◇*QUEEN HASUKI MENU*◇═╗

📋 *Available Commands*
━━━━━━━━━━━━━━━━━━━
`;

      for (let cat in categories) {
        menuText += `\n📂 *${cat.toUpperCase()}*\n`;
        let counter = 1;
        categories[cat].forEach(c => {
          menuText += `   ${counter}⃣ .${c.pattern} ➜ ${c.desc}\n`;
          counter++;
        });
      }

      menuText += `
━━━━━━━━━━━━━━━━━
👤 *Owner Contact*  
📱 WhatsApp: wa.me/94769983151  

🛡 *Zero Bug Zone*
╚═════════════════╝
`;

      await danuwa.sendMessage(from, { text: menuText }, { quoted: mek });

    } catch (err) {
      console.error(err);
      reply("❌ Error generating menu.");
    }
  }
);





