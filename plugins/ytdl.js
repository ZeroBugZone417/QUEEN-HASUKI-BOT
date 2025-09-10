const config = require('../config');
const { cmd } = require('../command');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

function replaceYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

cmd({
    pattern: "play3",
    alias: ["mp3", "ytmp3"],
    react: "🎵",
    desc: "Download Ytmp3",
    category: "download",
    use: ".song <Text or YT URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a Query or Youtube URL!");

        // ✅ Get video ID
        let id = q.startsWith("http") ? replaceYouTubeID(q) : null;
        if (!id) {
            const searchResults = await dy_scrap.ytsearch(q);
            if (!searchResults?.results?.length) return await reply("❌ No results found!");
            id = searchResults.results[0].videoId;
        }

        // ✅ Fetch video info
        const info = await dy_scrap.ytinfo(`https://youtube.com/watch?v=${id}`);
        if (!info?.result) return await reply("❌ Failed to fetch video info!");

        const { title, duration, views, ago, channel, thumbnail } = info.result;

        let caption = `🍄 *SONG DOWNLOADER* 🍄\n\n` +
            `🎵 *Title:* ${title}\n` +
            `⏳ *Duration:* ${duration}\n` +
            `👀 *Views:* ${views}\n` +
            `🌏 *Released:* ${ago}\n` +
            `👤 *Channel:* ${channel?.name}\n\n` +
            `🔽 *Reply with your choice:*\n` +
            `1.1 *Audio Type* 🎵\n` +
            `1.2 *Document Type* 📁\n\n` +
            `${config.FOOTER || "Zero Bug Zone"}`;

        const sentMsg = await conn.sendMessage(from, { image: { url: thumbnail }, caption }, { quoted: mek });

        // ✅ Listen only to THIS reply
        const filter = (u) =>
            u?.message?.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id;

        conn.ev.on("messages.upsert", async (update) => {
            try {
                const msg = update.messages[0];
                if (!msg?.message) return;
                if (!filter(msg)) return;

                let userReply = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
                if (!userReply) return;

                userReply = userReply.trim();

                // ✅ Download MP3
                const response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                let downloadUrl = response?.result?.download?.url;
                if (!downloadUrl) return await reply("❌ Download link not found!");

                if (userReply === "1.1") {
                    await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: mek });
                } else if (userReply === "1.2") {
                    await conn.sendMessage(from, { document: { url: downloadUrl }, fileName: `${title}.mp3`, mimetype: "audio/mpeg", caption: title }, { quoted: mek });
                } else {
                    await reply("❌ Invalid choice! Reply with 1.1 or 1.2.");
                }
            } catch (err) {
                console.error("Reply Handler Error:", err.message);
            }
        });

    } catch (error) {
        console.error(error);
        await reply(`❌ *An error occurred:* ${error.message}`);
    }
});
