const { cmd } = require("../command");

cmd(
  {
    pattern: "owner",
    react: "👑",
    desc: "Show Bot Owner Info with Image and Contact",
    category: "owner",
    filename: __filename,
  },
  async (hasuki, mek, m, { from, reply }) => {
    try {
      // Owner info text
      const ownerInfo = `
╔═•ೋ° ✧ BOT OWNER ✧ °ೋ•═╗
👤 Name: Dineth Sudarshana
📱 WhatsApp: +94769983151
💻 Role: Developer & Maintainer
🌐 GitHub: https://github.com/ZeroBugZone417
📸 Instagram: https://instagram.com/DinethSudarshana
✨ Bot Version: 1.0
╚═════════════════════╝
`;

      // Send image + caption
      await hasuki.sendMessage(from, {
        image: { url: "https://i.imgur.com/yourImage.jpg" }, // replace with your image URL
        caption: ownerInfo,
      }, { quoted: mek });

      // Send vCard contact separately
      const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:Dineth Sudarshana
TEL;waid=94769983151:+94769983151
END:VCARD
`;

      await hasuki.sendMessage(from, {
        contacts: { displayName: "Dineth Sudarshana", contacts: [{ vcard }] }
      }, { quoted: mek });

    } catch (e) {
      console.log(e);
      reply(`❌ Error: ${e.message || e}`);
    }
  }
);
