const { cmd } = require("../command");

cmd(
  {
    pattern: "owner",
    react: "👑",
    desc: "Show Bot Owner Info with Image",
    category: "main",
    filename: __filename,
  },
  async (bot, mek, m, { from, reply }) => {
    try {
      // Owner info text
      const ownerInfo = `
╔═══•ೋ•✧✧•ೋ•═══╗
  👑 BOT OWNER 👑
╚═══•ೋ•✧✧•ೋ•═══╝

👤 *Name* : Dineth Sudarshana
💻 *Role*  : Developer & Student
🌐 *GitHub* : https://github.com/ZeroBugZone417
🌎 *Country*  : Sri Lanka
✨ *Bot Version*: 1.0
📱 *WhatsApp*   : wa.me/94769983151
`;

      // Send image with caption
      await bot.sendMessage(
        from,
        {
          image: {
            url: "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/Zero%20Bug%20Zone.png?raw=true",
          },
          caption: ownerInfo,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      await reply(`❌ Error: ${e.message || e}`);
    }
  }
);
