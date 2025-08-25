const { cmd } = require("../command");
const yts = require("yt-search");
const { ytmp3 } = require("@vreden/youtube_scraper");
const axios = require("axios");

cmd(
  {
    pattern: "song",
    react: "🎶",
    desc: "Download Song from YouTube",
    category: "download",
    filename: __filename,
  },
  async (hasuki, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ Please provide a song name or YouTube link");

      const search = await yts(q);
      const data = search.videos[0];
      if (!data) return reply("❌ No results found");

      const url = data.url;
      let desc = `
🎵 *Song Downloader*
🎬 Title: ${data.title}
⏱️ Duration: ${data.timestamp}
📅 Uploaded: ${data.ago}
👀 Views: ${data.views.toLocaleString()}
🔗 Watch Here: ${data.url}
`;

      // Send video info with buttons
      const buttons = [
        { buttonId: `.songnow ${url}`, buttonText: { displayText: "📥 Download Audio" }, type: 1 },
        { buttonId: `.songdoc ${url}`, buttonText: { displayText: "📁 Download as File" }, type: 1 },
      ];

      const buttonMessage = {
        image: { url: data.thumbnail },
        caption: desc,
        footer: "✨ Queen Hasuki Bot ✨",
        buttons,
        headerType: 4,
      };

      await hasuki.sendMessage(from, buttonMessage, { quoted: mek });

      // Button handlers
      cmd(
        { pattern: "songnow", dontAddCommandList: true },
        async (hasuki, mek, m, { args }) => {
          const songData = await ytmp3(args[0], "192");
          const audioRes = await axios.get(songData.download.url, { responseType: "arraybuffer" });

          await hasuki.sendMessage(
            from,
            { audio: { buffer: audioRes.data, mimetype: "audio/mpeg" } },
            { quoted: mek }
          );
        }
      );

      cmd(
        { pattern: "songdoc", dontAddCommandList: true },
        async (hasuki, mek, m, { args }) => {
          const songData = await ytmp3(args[0], "192");
          const audioRes = await axios.get(songData.download.url, { responseType: "arraybuffer" });

          await hasuki.sendMessage(
            from,
            {
              document: { buffer: audioRes.data, mimetype: "audio/mpeg" },
              fileName: `${data.title}.mp3`,
              caption: "🎶 Your song is ready!",
            },
            { quoted: mek }
          );
        }
      );

    } catch (e) {
      console.log(e);
      reply(`❌ Error: ${e.message || e}`);
    }
  }
);
