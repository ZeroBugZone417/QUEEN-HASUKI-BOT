const { cmd } = require("../command");
const ytdl = require("ytdl-core");

cmd(
  {
    pattern: "yt",
    alias: ["youtube", "ytvideo"],
    react: "🎬",
    desc: "Download YouTube video or audio",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ Please provide a valid YouTube URL.");

      // Validate URL
      if (!ytdl.validateURL(q)) return reply("❌ Invalid YouTube URL!");

      reply("🎬 Downloading your video... Please wait.");

      // Get video info
      const info = await ytdl.getInfo(q);
      const title = info.videoDetails.title;

      // Download video (highest quality)
      const videoStream = ytdl(q, { quality: "highest" });

      let chunks = [];
      videoStream.on("data", (chunk) => chunks.push(chunk));
      videoStream.on("end", async () => {
        const videoBuffer = Buffer.concat(chunks);

        await bot.sendMessage(from, {
          video: videoBuffer,
          caption: `🎬 *${title}*`,
        }, { quoted: mek });
      });

    } catch (e) {
      console.error(e);
      reply("❌ Failed to download YouTube video.");
    }
  }
);
