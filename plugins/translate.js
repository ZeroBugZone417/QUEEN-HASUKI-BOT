const { cmd } = require("../command");
const translate = require("@iamtraction/google-translate"); // ✅ use maintained fork

// 🔹 Translate command
cmd(
  {
    pattern: "tr",
    react: "🌐",
    desc: "Translate text using Google Translate",
    category: "tools",
    filename: __filename,
  },
  async (bot, mek, m, { args, reply }) => {
    try {
      if (args.length < 2) {
        return reply(
          "❌ Usage: .tr [lang_code] [text]\n\nExample: .tr si Hello World"
        );
      }

      const lang = args[0]; // e.g., 'si' for Sinhala
      const text = args.slice(1).join(" ");

      const res = await translate(text, { to: lang });

      await reply(`🌐 *Translated (${lang})*\n\n📝 ${res.text}`);
    } catch (e) {
      console.error("Translation Error:", e);
      reply("❌ Translation failed. Try again!");
    }
  }
);
