const { cmd } = require("../command");
const fetch = require("node-fetch");

cmd(
  {
    pattern: "removebg",
    react: "✂️",
    desc: "Remove background from an image",
    category: "AI",
    filename: __filename,
  },
  async (bot, mek, m, { from, reply, quoted }) => {
    try {
      if (!quoted || !quoted.image) return reply("❌ Please reply to an image.");

      const buffer = await bot.downloadMediaMessage(quoted);

      // Using remove.bg API
      const form = new FormData();
      form.append("image_file", buffer, "image.png");
      form.append("size", "auto");

      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": process.env.REMOVE_BG_API_KEY
        },
        body: form
      });

      const resultBuffer = await res.buffer();

      await bot.sendMessage(from, { image: resultBuffer, caption: "✂️ Background removed!" }, { quoted: mek });

    } catch (e) {
      console.error(e);
      reply("❌ Failed to remove background.");
    }
  }
);
