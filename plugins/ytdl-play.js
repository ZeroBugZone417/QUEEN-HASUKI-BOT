const config = require('../config');
const { cmd } = require('../command');
const yts = require('yt-search');
const fetch = require("node-fetch"); // ⚡ if Node v18+, this is optional

cmd({
    pattern: "yt",
    alias: ["play2", "music"],
    react: "🎵",
    desc: "Download audio from YouTube",
    category: "download",
    use: ".yt2 <query or url>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a song name or YouTube URL!");

        let videoUrl, title;

        // ✅ If user gives direct YouTube URL
        if (q.match(/(youtube\.com|youtu\.be)/)) {
            videoUrl = q;
            const search = await yts({ videoId: q.split("v=")[1] });
            title = search?.title || "Unknown Title";
        } else {
            // ✅ If user gives keyword
            const search = await yts(q);
            if (!search.videos.length) return await reply("❌ No results found!");
            videoUrl = search.videos[0].url;
            title = search.videos[0].title;
        }

        await reply("⏳ Downloading audio...");

        // ✅ API call for mp3
        const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(videoUrl)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data?.status || !data?.result?.download_url) {
            return await reply("❌ Failed to download audio!");
        }

        // ✅ Send audio to user
        await conn.sendMessage(from, {
            audio: { url: data.result.download_url },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
        }, { quoted: mek });

        await reply(`✅ *${title}* downloaded successfully!`);

    } catch (error) {
        console.error(error);
        await reply(`❌ Error: ${error.message}`);
    }
});
