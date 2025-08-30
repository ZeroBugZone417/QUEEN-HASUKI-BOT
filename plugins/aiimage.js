const { cmd } = require("../command");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

cmd(
  {
    pattern: "aiimg",
    react: "🖼️",
    desc: "Generate image from text prompt",
    category: "AI",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ Please provide a prompt!");

      const result = await openai.images.generate({
        model: "dall-e-3",
        prompt: q,
        size: "1024x1024"
      });

      const imageUrl = result.data[0].url;

      await bot.sendMessage(from, { image: { url: imageUrl }, caption: `🖼️ Prompt: ${q}` }, { quoted: mek });

    } catch (e) {
      console.error(e);
      reply("❌ Failed to generate image.");
    }
  }
);
