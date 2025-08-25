const { cmd } = require("../command");

// ===== OWNER COMMAND WITH IMAGE, BUTTONS & vCard =====
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
👑 *Bot Owner Info*
📝 Name: Dineth Sudarshana
📱 WhatsApp: +94769983151
💻 Role: Developer & Maintainer
🌐 GitHub: https://github.com/ZeroBugZone417
📸 Instagram: https://instagram.com/DinethSudarshana
✨ Bot Version: 1.0
`;

      // Buttons
      const buttons = [
        { buttonId: ".owner", buttonText: { displayText: "📇 Contact" }, type: 1 },
        { buttonId: ".bc", buttonText: { displayText: "📢 Broadcast" }, type: 1 },
      ];

      // Send vCard contact
      const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:Dineth Sudarshana
TEL;waid=94769983151:+94769983151
END:VCARD
`;

      // Send message with image, caption, buttons & contact
      await hasuki.sendMessage(from, {
        image: { url: "https://i.imgur.com/yourImage.jpg" }, // replace with owner image URL
        caption: ownerInfo,
        buttons,
        headerType: 4,
        contacts: { displayName: "Dineth Sudarshana", contacts: [{ vcard }] },
      }, { quoted: mek });

    } catch (e) {
      console.log(e);
      reply(`❌ Error: ${e.message || e}`);
    }
  }
);
