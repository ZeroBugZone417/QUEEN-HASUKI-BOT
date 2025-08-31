const { cmd } = require("../command");
const gTTS = require("gtts"); // npm install gtts
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
      if (args.length < 2)
        return reply("❌ Example: .say si හෙලෝ\nLanguages: en, si, ta, hi...");

      let lang = args[0]; // ex: si / en
      let text = args.slice(1).join(" ");
      if (!text) return reply("❌ Please enter some text.");

      let filePath = "./tts.mp3";
      let tts = new gTTS(text, lang);

      // Save file properly
      tts.save(filePath, async (err) => {
        if (err) {
          console.error("TTS Error:", err);
          return reply("⚠️ Failed to generate TTS audio.");
        }

        try {
          await bot.sendMessage(
            m.chat,
            { audio: { url: filePath }, mimetype: "audio/mp4", ptt: true },
            { quoted: mek }
          );
        } catch (sendErr) {
          console.error("Send Error:", sendErr);
          reply("⚠️ Error sending audio file.");
        }

        // Delete temp file
        fs.unlinkSync(filePath);
      });
    } catch (e) {
      console.error("Main Error:", e);
      reply("⚠️ Error in TTS command!");
    }
  }
);
