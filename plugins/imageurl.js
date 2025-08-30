const { cmd } = require("../command");

cmd(
  {
    pattern: "imgurl",
    alias: ["image", "pic"],
    react: "🖼️",
    desc: "Send an image from a URL",
    category: "tools",
    filename: __filename,
  },
  async (bot, mek, m, { from, args, reply }) => {
    try {
      if (!args || args.length === 0)
        return reply("❌ Usage: .imgurl [image URL]\nExample: .imgurl https://i.imgur.com/example.jpg");

      const imageUrl = args[0];

      // Send the image directly without buttons
      await bot.sendMessage(from, {
        image: { url: imageUrl },
        caption: `🖼️ Here’s your image:\n${imageUrl}`,
      }, { quoted: mek });

    } catch (e) {
      console.error(e);
      reply("❌ Failed to send image. Make sure the URL is correct and points directly to an image.");
    }
  }
);
