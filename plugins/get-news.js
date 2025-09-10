const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "news",
    desc: "Get the latest news from ITN and Ada Derana.",
    category: "news",
    react: "📰",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Fetch ITN news
        const itnResponse = await axios.get('https://supun-md-api-rho.vercel.app/api/news/itn');
        const itnArticles = itnResponse.data.articles || itnResponse.data.data || [];

        // Fetch Ada Derana news
        const adaResponse = await axios.get('https://supun-md-api-rho.vercel.app/api/news/adaderana');
        const adaArticles = adaResponse.data.articles || adaResponse.data.data || [];

        // Combine articles
        const allArticles = [...itnArticles, ...adaArticles];

        if (!allArticles.length) {
            return await reply("❌ No news articles found.");
        }

        // Limit to 5 articles
        const articlesToSend = allArticles.slice(0, 5);

        for (const article of articlesToSend) {
            const title = article.title || "No Title";
            const description = article.description || "No Description";
            const url = article.url || "No URL";
            const imageUrl = article.urlToImage;

            const message = `
📰 *${title}*
⚠️ _${description}_
🔗 _${url}_

©Powerd By Zero Bug Zone
            `;

            try {
                if (imageUrl) {
                    // Send image with caption
                    await conn.sendMessage(from, {
                        image: { url: imageUrl },
                        caption: message,
                        mimetype: 'image/jpeg'
                    });
                } else {
                    // Send as text if no image
                    await conn.sendMessage(from, { text: message });
                }
            } catch (err) {
                console.error("Failed to send article:", err);
                await reply(`⚠️ Failed to send an article: ${title}`);
            }
        }

    } catch (err) {
        console.error("Error fetching news:", err);
        await reply("❌ Could not fetch news. Please try again later.");
    }
});
