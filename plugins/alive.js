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

      // --- Alive Image & Styled Caption ---
      await malvin.sendMessage(
        from,
        {
          image: {
            url: "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/LOGO.png?raw=true",
          },
          caption: `╔════◇👑 Queen Hasuki ◇════╗
1️⃣ Bot Status: ONLINE ✅
2️⃣ Ready to receive commands instantly ⚡
3️⃣ Stay tuned & enjoy seamless chatting 😎
━━━━━━━━━━━━━━━━━━━━
💡 Need help? Contact the owner by pressing the button below
╚════════════════════════════╝`,
          footer: "🛡©Zero Bug Zone 🛡",
          buttons: [
            { 
              buttonId: "owner_button", 
              buttonText: { displayText: "👤 Owner" }, 
              type: 1 
            }
          ],
          headerType: 4
        },
        { quoted: mek }
      );

      // --- Delay ---
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // --- Voice Message ---
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

      // --- Button click handler ---
      malvin.ev.on("messages.upsert", async ({ messages }) => {
        const m = messages[0];
        const selected = m.message?.buttonsResponseMessage?.selectedButtonId;
        if (selected === "owner_button") {
          await malvin.sendMessage(from, {
            text: `👤 Owner Contact Details:
📱 WhatsApp: wa.me/94769983151
✉ Email: owner@example.com
💬 Reply here for support!`
          }, { quoted: m });
        }
      });

    } catch (e) {
      console.error("❌ Error in .alive command:", e);
      reply("❌ Error while sending alive message!");
    }
  }
);
