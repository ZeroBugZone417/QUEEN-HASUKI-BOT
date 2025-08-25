const { cmd } = require("../command");

// ===== OWNER COMMAND =====

// 🔹 Show bot owner info
cmd(
  {
    pattern: "owner",
    react: "👑",
    desc: "Show Bot Owner Info",
    category: "owner",
    filename: __filename,
  },
  async (hasuki, mek, m, { from, reply }) => {
    try {
      const ownerInfo = `
👑 *Bot Owner Info*
📝 Name: Queen Hasuki
📱 WhatsApp: +947XXXXXXXX
💻 Role: Developer & Maintainer
✨ Bot Version: 4.0
`;
      await reply(ownerInfo);
    } catch (e) {
      console.log(e);
      reply(`❌ Error: ${e.message || e}`);
    }
  }
);

// 🔹 Broadcast message to a number (example owner-only command)
cmd(
  {
    pattern: "ownwr",
    react: "📢",
    desc: "owner info",
    category: "owner data",
    filename: __filename,
  },
  async (hasuki, mek, m, { from, args, reply }) => {
    try {
      const ownerNumber = "94769983151"; // Replace with your WhatsApp number
      if (m.sender !== ownerNumber + "@s.whatsapp.net") return reply("❌ Only owner can use this command");

      const message = args.join(" ");
      if (!message) return reply("❌ Please provide a message to broadcast");

      // Example: send message to a specific chat
      await hasuki.sendMessage(from, { text: `📢 Broadcast from owner:\n\n${message}` });
      await reply("✅ Broadcast sent!");
    } catch (e) {
      console.log(e);
      reply(`❌ Error: ${e.message || e}`);
    }
  }
);
