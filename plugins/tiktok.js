
const { cmd } = require("../command");
const fetch = require("node-fetch");

cmd(
  {
    pattern: "tiktok",
    alias: ["tt", "tiktokdl"],
    react: "🎶",
    desc: "Download TikTok Video",
    category: "download",
    filename: __filename,
  },
  async (hasuki, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("*Please provide a valid TikTok video URL!* 🎶");

      const tiktokRegex = /(https?:\/\/)?(www\.)?(tiktok\.com)\/.+/;
      if (!tiktokRegex.test(q))
        return reply("*Invalid TikTok URL! Please check and try again.* ☹️");

      reply("*Fetching TikTok video...* 🎶");

      // ✅ Use TikWM API
      const api = `https://tikwm.com/api/?url=${q}`;
      const res = await fetch(api);
      const json = await res.json();

      if (!json || !json.data) {
        return reply("*Failed to download video. Please try again later.* ☹️");
      }

      const videoNoWM = json.data.play;   // no watermark
      const videoWM = json.data.wmplay;   // with watermark
      const caption = json.data.title || "No description";

      // Buttons for user choice
      const buttons = [
        { buttonId: `.ttnowm ${q}`, buttonText: { displayText: "📥 No Watermark" }, type: 1 },
        { buttonId: `.ttwm ${q}`, buttonText: { displayText: "📥 With Watermark" }, type: 1 },
      ];

      const buttonMessage = {
        image: { url: json.data.cover },
        caption: `꧁༺Hasuki TikTok Downloader༻꧂\n\n🎵 *Caption*: ${caption}\n\nChoose your download option 👇`,
        footer: "✨ Queen Hasuki Bot ✨",
        buttons: buttons,
        headerType: 4,
      };

      await hasuki.sendMessage(from, buttonMessage, { quoted: mek });

      // Extra commands for button actions
      cmd(
        {
          pattern: "ttnowm",
          dontAddCommandList: true,
        },
        async (hasuki, mek, m, { args }) => {
          await hasuki.sendMessage(from, {
            video: { url: videoNoWM },
            caption: "*📥 Downloaded without watermark*",
          }, { quoted: mek });
        }
      );

      cmd(
        {
          pattern: "ttwm",
          dontAddCommandList: true,
        },
        async (hasuki, mek, m, { args }) => {
          await hasuki.sendMessage(from, {
            video: { url: videoWM },
            caption: "*📥 Downloaded with watermark*",
          }, { quoted: mek });
        }
      );

    } catch (e) {
      console.error(e);
      reply(`*Error:* ${e.message || e}`);
    }
  }
);
