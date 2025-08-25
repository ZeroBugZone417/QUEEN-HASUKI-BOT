const { cmd } = require("../command");
const yts = require("yt-search");
const ytdl = require("ytdl-core");
const axios = require("axios");

// 🔹 .song command
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

      // YouTube search
      const search = await yts(q);
      const data = search.videos[0];
      if (!data) return reply("❌ No results found");

      // Validate URL
      if (!ytdl.validateURL(data.url)) return reply("❌ Invalid YouTube URL");

      let desc = `
🎵 *Song Downloader*
🎬 Title: ${data.title}
⏱️ Duration: ${data.timestamp}
📅 Uploaded: ${data.ago}
👀 Views: ${data.views.toLocaleString()}
🔗 Watch Here: ${data.url}
`;

      const buttons = [
        { buttonId: `.songnow ${data.url}`, buttonText: { displayText: "📥 Download Audio" }, type: 1 },
        { buttonId: `.songdoc ${data.url}`, buttonText: { displayText: "📁 Download as File" }, type: 1 },
      ];

      const buttonMessage = {
        image: { url: data.thumbnail },
        caption: desc,
        footer: "✨ Queen Hasuki Bot ✨",
        buttons,
        headerType: 4,
      };

      await hasuki.sendMessage(from, buttonMessage, { quoted: mek });

    } catch (e) {
      console.log(e);
      reply(`❌ Error: ${e.message || e}`);
    }
  }
);

// 🔹 .songnow → send audio as voice/music
cmd(
  { pattern: "songnow", dontAddCommandList: true },
  async (hasuki, mek, m, { args, from, reply }) => {
    try {
      if (!args[0]) return reply("❌ Provide a YouTube link!");
      if (!ytdl.validateURL(args[0])) return reply("❌ Invalid YouTube URL");

      const stream = ytdl(args[0], { filter: 'audioonly', quality: 'highestaudio' });
      const chunks = [];

      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', async () => {
        const buffer = Buffer.concat(chunks);
        await hasuki.sendMessage(
          from,
          { audio: { buffer, mimetype: "audio/mpeg" } },
          { quoted: mek }
        );
      });

      stream.on('error', err => {
        console.log(err);
        reply(`❌ Error downloading audio: ${err.message}`);
      });

    } catch (e) {
      console.log(e);
      reply(`❌ Error: ${e.message || e}`);
    }
  }
);

// 🔹 .songdoc → send audio as document
cmd(
  { pattern: "songdoc", dontAddCommandList: true },
  async (hasuki, mek, m, { args, from, reply }) => {
    try {
      if (!args[0]) return reply("❌ Provide a YouTube link!");
      if (!ytdl.validateURL(args[0])) return reply("❌ Invalid YouTube URL");

      const stream = ytdl(args[0], { filter: 'audioonly', quality: 'highestaudio' });
      const chunks = [];

      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', async () => {
        const buffer = Buffer.concat(chunks);
        await hasuki.sendMessage(
          from,
          {
            document: { buffer, mimetype: "audio/mpeg" },
            fileName: "song.mp3",
            caption: "🎶 Your song is ready!",
          },
          { quoted: mek }
        );
      });

      stream.on('error', err => {
        console.log(err);
        reply(`❌ Error downloading file: ${err.message}`);
      });

    } catch (e) {
      console.log(e);
      reply(`❌ Error: ${e.message || e}`);
    }
  }
);
