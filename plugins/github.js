const { cmd } = require("../command");

cmd(
  {
    pattern: "repo",
    react: "💻",
    desc: "Show GitHub repository link of the bot (button style)",
    category: "main",
    filename: __filename,
    fromMe: false,
  },
  async (malvin, mek, m, { reply }) => {
    try {
      const from = mek.key.remoteJid;
      const repoLink = "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT";

      await malvin.sendMessage(from, {
        text: "💻 *Queen Hasuki Bot GitHub Repository*\n\nClick the button below to open the repo!",
        buttons: [
          {
            buttonId: "open_repo",
            buttonText: { displayText: "🔗 View Repo" },
            type: 1
          }
        ],
        headerType: 1
      }, { quoted: mek });

      // Button click handler
      malvin.ev.on("messages.upsert", async ({ messages }) => {
        const m = messages[0];
        const selected = m.message?.buttonsResponseMessage?.selectedButtonId;
        if (selected === "open_repo") {
          await malvin.sendMessage(from, {
            text: `💻 GitHub Repo Link:\n${repoLink}`
          }, { quoted: m });
        }
      });

    } catch (e) {
      console.error("❌ Error in .repo command:", e);
      reply("❌ Couldn't send GitHub repo info!");
    }
  }
);
