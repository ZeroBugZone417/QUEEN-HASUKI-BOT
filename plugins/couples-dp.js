const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "couplepp",
  alias: ["couple", "cpp"],
  react: '💑',
  desc: "Get a male and female couple profile picture.",
  category: "image",
  use: ".couplepp",
  filename: __filename
}, async (conn, m, store, { from, args }) => {
  try {
    await conn.sendMessage(from, { text: "*💑 Fetching couple profile pictures...*" }, { quoted: m });

    const response = await axios.get("https://api.davidcyriltech.my.id/couplepp");

    if (!response.data || !response.data.success) {
      return conn.sendMessage(from, { text: "❌ Failed to fetch couple profile pictures. Please try again later." }, { quoted: m });
    }

    const { male, female } = response.data;

    if (male) {
      await conn.sendMessage(from, {
        image: { url: male },
        caption: "👨 Male Couple Profile Picture"
      }, { quoted: m });
    }

    if (female) {
      await conn.sendMessage(from, {
        image: { url: female },
        caption: "👩 Female Couple Profile Picture"
      }, { quoted: m });
    }

  } catch (error) {
    console.error(error);
    await conn.sendMessage(from, { text: "❌ An error occurred while fetching the couple profile pictures." }, { quoted: m });
  }
});
