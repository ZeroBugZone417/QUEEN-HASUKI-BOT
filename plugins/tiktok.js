const { cmd } = require("../command");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

cmd(
  {
    pattern: "tiktok",
    alias: ["tt", "tiktokdl"],
    react: "🎶",
    desc: "Download TikTok Video (No Watermark)",
    category: "download",
    filename: __filename,
  },
  async (hasuki, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ *Please provide a valid TikTok video URL!* 🎶");

      const tiktokRegex = /(https?:\/\/)?(www\.)?(tiktok\.com)\/.+/;
      if (!tiktokRegex.test(q)) return reply("⚠️ *Invalid TikTok URL!*");

      reply("⏳ *Fetching TikTok video...* 🎶");

      // TikWM API
      const api = `https://tikwm.com/api/?url=${q}`;
      const res = await fetch(api);
      const json = await res.json();

      if (!json?.data) return reply("❌ *Failed to fetch video.*");

      const { play: videoNoWM, cover, title } = json.data;
      const caption = title || "No description";

      // Send Stylish Message + Video
      await hasuki.sendMessage(
        from,
        {
          video: { url: videoNoWM },
          jpegThumbnail: { url: cover },
          caption: `╔══✦•❀•✦══╗
   🎶 *TIKTOK DOWNLOADER* 🎶
╚══✦•❀•✦══╝

📌 *Caption:* ${caption}
✅ *Downloaded Without Watermark*

✨ Powered by Zero Bug Zone✨`,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply(`❗ *Error:* ${e.message || e}`);
    }
  }
);

