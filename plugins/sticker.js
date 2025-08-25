const { cmd } = require("../command");

cmd(
  {
    pattern: "sticker",
    react: "✨",
    desc: "Convert image/video to sticker",
    category: "fun",
    filename: __filename,
  },
  async (conn, mek, m, { from, reply }) => {
    try {
      if (!m.quoted) return reply("📸 Reply an image or video with .sticker");

      let media = await m.quoted.download();
      await conn.sendMessage(
        from,
        { sticker: media },
        { quoted: mek }
      );
    } catch (e) {
      console.log(e);
      reply("❌ Error making sticker!");
    }
  }
);
