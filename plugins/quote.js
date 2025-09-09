const { cmd } = require("../command");
const gTTS = require("gtts"); // install with: npm i gtts
const fs = require("fs");

cmd(
  {
    pattern: "say",
    desc: "Convert text to speech (TTS)",
    category: "tools",
    react: "🎤",
    filename: __filename,
  },
  async (bot, mek, m, { args, reply }) => {
    try {
      if (!args[0]) return reply("❌ Example: .say si හෙලෝ");
      
      let lang = args[0]; // language code (en, si, ta, hi...)
      let text = args.slice(1).join(" ");
      if (!text) return reply("❌ Please enter some text.");

      const gtts = new gTTS(text, lang);
      const filePath = "./tts.mp3";

      gtts.save(filePath, async function (err) {
        if (err) {
          reply("❌ Error generating audio!");
        } else {
          await bot.sendMessage(
            m.chat,
            { audio: { url: filePath }, mimetype: "audio/mp4", ptt: true },
            { quoted: mek }
          );
          fs.unlinkSync(filePath); // delete temp file
        }
      });
    } catch (e) {
      reply("⚠️ Error in TTS command!");
    }
  }
);
