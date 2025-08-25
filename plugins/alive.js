const { cmd } = require("../command");

cmd(
  {
    pattern: "alive",
    react: "🤖",
    desc: "Show bot status",
    category: "main",
    filename: __filename,
    fromMe: false,
  },
  async (malvin, mek, m, { reply }) => {
    try {
      const from = mek.key.remoteJid;

      await malvin.sendPresenceUpdate("recording", from);

      // Alive Image & Caption
      await malvin.sendMessage(
        from,
        {
          image: {
            url: "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/LOGO.png?raw=true",
          },
          caption: `👑 Queen Hasuki 👑
━━━━━━━━━━━━━━━

💥 Bot Status: ONLINE ✅
  
Hey! I’m your WhatsApp Bot, awake and ready for action.  

Type any command or question, and I’ll get back to you instantly! ⚡  

Stay tuned for updates, enjoy seamless chatting, and let’s make your experience awesome! 😎  

━━━━━━━━━━━━━━━
🛡©Zero Bug Zone 🛡`,
        },
        { quoted: mek }
      );

      // Delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Voice Message
      await malvin.sendMessage(
        from,
        {
          audio: {
            url: "https://files.catbox.moe/wz8rh7.mp3",
          },
          mimetype: "audio/mpeg",
          ptt: true,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("❌ Error in .alive command:", e);
      reply("❌ Error while sending alive message!");
    }
          })
