const { cmd } = require("../command");

cmd(
  {
    pattern: "rul",
    react: "📜",
    desc: "Show group rules",
    category: "main",
    filename: __filename,
    fromMe: false,
  },
  async (malvin, mek, m, { reply }) => {
    try {
      const from = mek.key.remoteJid;

      await malvin.sendPresenceUpdate("composing", from);

      await malvin.sendMessage(
        from,
        {
          image: {
            url: "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/QUEEN%20HASUKI.png?raw=true",
          },
          caption: `📜 *Group Rules* 👑

1️⃣ Be respectful to all members 🙏
2️⃣ No spamming 🚫
3️⃣ No links without admin permission 🔗
4️⃣ Use clean language 🧼
5️⃣ Enjoy and have fun 🎉

⚠️ Breaking rules may lead to removal!
            
👑 Powered by Queen Hasuki Bot`,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("❌ Error in .rul command:", e);
      reply("❌ Error while sending rules!");
    }
  }
);
