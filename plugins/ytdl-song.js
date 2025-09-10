const { cmd } = require("../command");
const yts = require("yt-search");
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

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

    await reply("⏳ Fetching video info, please wait...");

    // Fetch video info with ytdl-core
    info = await ytdl.getInfo(videoUrl);

    const title = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;

    // Send video metadata + thumbnail
    const desc = `
🧩 *AUDIO DOWNLOADER* 🧩

📌 *Title:* ${title}
⏱️ *Uploaded:* ${info.videoDetails.uploadDate || "N/A"}
👀 *Views:* ${parseInt(info.videoDetails.viewCount).toLocaleString() || "N/A"}
🔗 *URL:* ${videoUrl}

━━━━━━━━━━━━━━━━━━
*${process.env.DESCRIPTION || "ZERO BUG ZONE🪀"}*
    `.trim();

    await bot.sendMessage(
      from,
      { image: { url: thumbnail }, caption: desc },
      { quoted: mek }
    );

    await reply("⏳ Downloading audio, please wait...");

    // Download audio to temp file
    const fileName = path.join(__dirname, `${title}.mp3`);
    const stream = ytdl(videoUrl, { filter: "audioonly", quality: "highestaudio" });
    const writeStream = fs.createWriteStream(fileName);

    stream.pipe(writeStream);

    writeStream.on("finish", async () => {
      await bot.sendMessage(
        from,
        {
          audio: { url: fileName },
          mimetype: "audio/mpeg",
          fileName: `${title}.mp3`,
        },
        { quoted: mek }
      );

      fs.unlinkSync(fileName); // delete temp file
      await reply(`✅ *${title}* downloaded successfully!`);
    });

    writeStream.on("error", (err) => {
      console.error(err);
      reply("❌ Failed to download audio!");
    });

  } catch (error) {
    console.error(error);
    reply(`❌ Error: ${error.message}`);
  }
});
