const { cmd } = require("../command");
const yts = require("yt-search");
const axios = require("axios");
const config = require("../config"); // ensure this loads .env variables

cmd({
  pattern: "song",
  alias: ["yt", "play2", "music"],
  react: "🎵",
  desc: "Download YouTube Audio",
  category: "download",
  use: ".song <name or URL>",
  filename: __filename,
}, async (bot, mek, m, { from, args, reply }) => {
  try {
    const query = args.join(" ");
    if (!query) return reply("❌ Please provide a song name or YouTube URL!");

    let videoUrl, info;

    // Check if it's a URL
    try {
      videoUrl = new URL(query).toString();
    } catch {
      // If keyword, search YouTube
      const search = await yts(query);
      if (!search?.videos?.length) return reply("❌ No videos found!");
      videoUrl = search.videos[0].url;
    }

    // Validate URL
    if (!videoUrl.includes("youtube.com") && !videoUrl.includes("youtu.be")) {
      return reply("❌ Invalid YouTube URL!");
    }

    // Fetch video info
    const searchInfo = await yts(videoUrl);
    if (!searchInfo?.videos?.length) return reply("❌ Failed to fetch video info!");
    info = searchInfo.videos[0];

    // Send video metadata + thumbnail
    const desc = `
🧩 *AUDIO DOWNLOADER* 🧩

📌 *Title:* ${info.title}
⏱️ *Uploaded:* ${info.timestamp || "N/A"} (${info.ago || "N/A"})
👀 *Views:* ${info.views?.toLocaleString() || "N/A"}
🔗 *URL:* ${info.url}

━━━━━━━━━━━━━━━━━━
*${process.env.DESCRIPTION || "ZERO BUG ZONE🪀"}*
    `.trim();

    await bot.sendMessage(
      from,
      { image: { url: info.thumbnail }, caption: desc },
      { quoted: mek }
    );

    await reply("⏳ Downloading audio, please wait...");

    // Download audio from API
    const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(videoUrl)}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data?.status || !data?.result?.download_url) {
      return reply("❌ Failed to download audio!");
    }

    // Send audio
    await bot.sendMessage(
      from,
      {
        audio: { url: data.result.download_url },
        mimetype: "audio/mpeg",
        fileName: `${info.title}.mp3`,
      },
      { quoted: mek }
    );

    await reply(`✅ *${info.title}* downloaded successfully!`);
  } catch (error) {
    console.error(error);
    reply(`❌ Error: ${error.message}`);
  }
});
