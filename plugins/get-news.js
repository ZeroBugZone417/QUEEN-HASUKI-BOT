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
        const itnArticles = itnResponse.data.articles;

        // Fetch Ada Derana news
        const adaDeranaResponse = await axios.get('https://supun-md-api-rho.vercel.app/api/news/adaderana');
        const adaDeranaArticles = adaDeranaResponse.data.articles;

        // Combine both articles
        const allArticles = [...itnArticles, ...adaDeranaArticles];

        if (!allArticles.length) return await reply("❌ No news articles found.");

        // Send each article as a separate message with image and title
        for (let i = 0; i < Math.min(allArticles.length, 5); i++) {
            const article = allArticles[i];
            let message = `
📰 *${article.title}*
⚠️ _${article.description}_
🔗 _${article.url}_

  ©Powered by zero bug zone
            `;

            if (article.urlToImage) {
                // Send image with caption
                await conn.sendMessage(from, { image: { url: article.urlToImage }, caption: message });
            } else {
                // Send text message if no image is available
                await conn.sendMessage(from, { text: message });
            }
        }
    } catch (e) {
        console.error("Error fetching news:", e);
        await reply("❌ Could not fetch news. Please try again later.");
    }
});
