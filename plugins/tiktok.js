const { cmd } = require("../command");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

cmd(
  {
    pattern: "tiktok",
    alias: ["tt", "tiktokdl"],
    react: "🎶",
    desc: "Download TikTok Video",
    category: "download",
    filename: __filename,
  },
  async (hasuki, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ *Please provide a valid TikTok video URL!* 🎶");

      const tiktokRegex = /(https?:\/\/)?(www\.)?(tiktok\.com)\/.+/;
      if (!tiktokRegex.test(q))
        return reply("⚠️ *Invalid TikTok URL!*");

      reply("⏳ *Fetching TikTok video...* 🎶");

      // TikWM API
      const api = `https://tikwm.com/api/?url=${q}`;
      const res = await fetch(api);
      const json = await res.json();

      if (!json?.data) return reply("❌ *Failed to fetch video.*");

      const { play: videoNoWM, wmplay: videoWM, cover, title } = json.data;
      const caption = title || "No description";

      // Buttons with encoded video URLs
      const buttons = [
        { buttonId: `ttnowm_${encodeURIComponent(videoNoWM)}`, buttonText: { displayText: "📥 No Watermark" }, type: 1 },
        { buttonId: `ttwm_${encodeURIComponent(videoWM)}`, buttonText: { displayText: "📥 With Watermark" }, type: 1 },
      ];

      const buttonMessage = {
        image: { url: cover },
        caption: `╔═•ೋ° ✧ HASUKI TIKTOK ✧ °ೋ•═╗
🎵 *Caption:* ${caption}
╚═════════════════════╝
Choose your download option 👇`,
        footer: "✨ Queen Hasuki Bot ✨",
        buttons,
        headerType: 4,
      };

      await hasuki.sendMessage(from, buttonMessage, { quoted: mek });
    } catch (e) {
      console.error(e);
      reply(`❗ *Error:* ${e.message || e}`);
    }
  }
);

// Button command: No watermark
cmd(
  { pattern: /^ttnowm_(.*)$/, dontAddCommandList: true },
  async (hasuki, mek, m, { match }) => {
    const videoUrl = decodeURIComponent(match[1]);
    await hasuki.sendMessage(m.key.remoteJid, {
      video: { url: videoUrl },
      caption: "✅ *Downloaded without watermark*",
    }, { quoted: mek });
  }
);

// Button command: With watermark
cmd(
  { pattern: /^ttwm_(.*)$/, dontAddCommandList: true },
  async (hasuki, mek, m, { match }) => {
    const videoUrl = decodeURIComponent(match[1]);
    await hasuki.sendMessage(m.key.remoteJid, {
      video: { url: videoUrl },
      caption: "✅ *Downloaded with watermark*",
    }, { quoted: mek });
  }
);

