const { cmd } = require("../command");
const getFbVideoInfo = require("@xaviabot/fb-downloader");

cmd(
  {
    pattern: "fb",
    alias: ["facebook"],
    react: "✅",
    desc: "Download public Facebook video",
    category: "download",
    filename: __filename,
  },
  async (hasuki, mek, m, { from, q, reply }) => {
    try {
      if (!q) 
        return reply("❌ *Please provide a valid Facebook video URL!*");

      const fbRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/.+/;
      if (!fbRegex.test(q))
        return reply("⚠️ *Invalid Facebook URL! Please check and try again.*");

      reply("⏳ *Downloading your video...*");

      const result = await getFbVideoInfo(q);
      if (!result || (!result.sd && !result.hd))
        return reply("❌ *Failed to download video. Please try again later.*");

      const { title, sd, hd } = result;
      const bestQualityUrl = hd || sd;
      const qualityText = hd ? "HD" : "SD";

      // Build clean menu text with Queen Hasuki header
      const desc = `
👑 *Queen Hasuki* 👑
🎬 *Title:* ${title || "Unknown"}
📺 *Quality:* ${qualityText}
✅ *Video ready to download!*
`;

      // Send thumbnail first
      await hasuki.sendMessage(
        from,
        {
          image: {
            url: "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/QUEEN%20HASUKI.png?raw=true",
          },
          caption: desc,
        },
        { quoted: mek }
      );

      // Then send video
      await hasuki.sendMessage(
        from,
        {
          video: { url: bestQualityUrl },
          caption: `🌟 *Downloaded successfully in ${qualityText} quality!*`,
        },
        { quoted: mek }
      );

      return reply("💖 *Thank you for using Queen Hasuki!*");
    } catch (e) {
      console.error(e);
      reply(`❗ *Error:* ${e.message || e}`);
    }
  }
);

