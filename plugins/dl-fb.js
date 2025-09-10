/**
 * Facebook Video Downloader Plugin for WhatsApp Bot
 * Author: Dineth Sudarshana
 * Bot Command: .facebookdl
 */

const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "facebookdl",
  alias: ["fb", "fbdl", "fbvideo"],
  desc: "Download Facebook videos easily",
  category: "download",
  filename: __filename,
  use: "<Facebook URL>",
}, async (conn, m, store, { from, q, reply }) => {
  try {
    // Validate URL
    if (!q || !q.startsWith("http")) {
      return reply("*❌ Please provide a valid Facebook URL*\n\nExample: `.facebookdl https://www.facebook.com/...`");
    }

    // Show loading reaction
    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    // Fetch video data from API
    const apiUrl = `https://api.fbdown.net/api/video?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.status || !data.data?.url) {
      return reply("❌ Failed to fetch the video. Make sure the URL is correct or try another video.");
    }

    const videoUrl = data.data.url;

    // Send video to WhatsApp
    await conn.sendMessage(from, {
      video: { url: videoUrl },
      caption: `📥 *Facebook Video Downloaded*\n- Powered By JesterTechX ✅`,
    }, { quoted: m });

  } catch (error) {
    console.error("FacebookDL Error:", error);
    reply("❌ An error occurred while downloading the video. Try again later.");
  }
});
