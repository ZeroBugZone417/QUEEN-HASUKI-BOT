const { cmd } = require("../command");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Set your OpenAI API Key
});

cmd(
  {
    pattern: "chatgpt",
    react: "🤖",
    desc: "Ask something from ChatGPT",
    category: "AI",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ Please ask something!");

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: q }]
      });

      await reply(response.choices[0].message.content);

    } catch (e) {
      console.error(e);
      reply("❌ ChatGPT request failed.");
    }
  }
);
