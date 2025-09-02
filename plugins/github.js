const { cmd } = require("../command");

cmd(
  {
    pattern: "repo",
    react: "💻",
    desc: "Show GitHub repository link with styled caption",
    category: "main",
    filename: __filename,
    fromMe: false,
  },
  async (malvin, mek, m, { reply }) => {
    try {
      const from = mek.key.remoteJid;
      const repoLink = "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT";

      await malvin.sendMessage(from, {
        image: { url: "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/QUEEN%20HASUKI.png?raw=true" },
        caption: `💻 *Queen Hasuki Bot GitHub Repository*\n
🔗 Repo: ${repoLink}\n
📌 View the source code and contribute!\n
🛡️ Stay safe and enjoy chatting! 😎\n
⚡ Keep exploring new features and commands!`,
      }, { quoted: mek });

    } catch (e) {
      console.error("❌ Error in .repo command:", e);
      reply("❌ Couldn't fetch GitHub repo info!");
    }
  }
);
