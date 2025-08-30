const { cmd } = require("../command");

cmd(
  {
    pattern: "owner",
    react: "👑",
    desc: "Show Bot Owner Info with Image",
    category: "owner",
    filename: __filename,
  },
  async (bot, mek, m, { from, reply }) => {
    try {
      // Owner info text with updated role
      const ownerInfo = `
╔═•ೋ° ✧ BOT OWNER ✧ °ೋ•═╗
👤 Name       : Dineth Sudarshana
💻 Role       : Developer & Student
🌐 GitHub     : https://github.com/ZeroBugZone417
📸 Instagram : https://instagram.com/DinethSudarshana
🌎 Country    : Sri Lanka
✨ Bot Version: 1.0
╠═════════════════════╣
📱 WhatsApp: +94769983151
╚═════════════════════╝
`;

      // Send image + caption in a single message
      await bot.sendMessage(from, {
        image: { url: "https://raw.githubusercontent.com/ZeroBugZone417/QUEEN-HASUKI-BOT/main/lib/LOGO.png" },
        caption: ownerInfo,
      }, { quoted: mek });

    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message || e}`);
    }
  }
);
