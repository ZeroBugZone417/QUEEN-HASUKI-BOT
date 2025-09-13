const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ytpost",
    alias: ["ytcommunity", "ytc"],
    desc: "Download a YouTube community post",
    category: "downloader",
    react: "🎥",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, react }) => {
    try {
        if (!q) return reply("❌ Please provide a YouTube community post URL.\nExample: `.ytpost <url>`");

        const apiUrl = `https://api.siputzx.my.id/api/d/ytpost?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.status || !data.data) {
            await react("❌");
            return reply("❌ Failed to fetch the community post. Please check the URL.");
        }

        const post = data.data;
        let caption = `📢 *YouTube Community Post* 📢\n\n` +
                      `📜 *Content:* ${post.content || "(No text)"}\n`;

        if (post.images && post.images.length > 0) {
            for (let i = 0; i < Math.min(post.images.length, 5); i++) {
                await conn.sendMessage(from, { image: { url: post.images[i] }, caption }, { quoted: mek });
                caption = ""; // caption only once
            }
        } else {
            await conn.sendMessage(from, { text: caption }, { quoted: mek });
        }

        await react("✅");
    } catch (e) {
        console.error("Error in ytpost command:", e);
        await react("❌");
        reply("⚠️ Error: " + (e.response?.data?.message || e.message));
    }
});
