
const { cmd, commands } = require("../command");
const fetch = require("node-fetch");

cmd(
  {
    pattern: "tiktok",
    alias: ["tt", "tiktokdl"],
    react: "🎶",
    desc: "Download TikTok Video",
    category: "download",
    filename: __filename,
  },
  async (
    hasuki,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      isGroup,
      sender,
      senderNumber,
      botNumber2,
      botNumber,
      pushname,
      isMe,
      isOwner,
      groupMetadata,
      groupName,
      participants,
      groupAdmins,
      isBotAdmins,
      isAdmins,
      reply,
    }
  ) => {
    try {
      if (!q) return reply("*Please provide a valid TikTok video URL!* 🎶");

      const tiktokRegex = /(https?:\/\/)?(www\.)?(tiktok\.com)\/.+/;
      if (!tiktokRegex.test(q))
        return reply("*Invalid TikTok URL! Please check and try again.* ☹️");

      reply("*Downloading your TikTok video...* 🎶");

      // Free API (no watermark & with watermark)
      const api = `https://api.douyin.wtf/api?url=${q}`;
      const res = await fetch(api);
      const data = await res.json();

      if (!data || !data.nwm_video_url) {
        return reply("*Failed to download video. Please try again later.* ☹️");
      }

      const { desc, wm_video_url, nwm_video_url } = data;

      const captionTxt = `꧁༺Hasuki TikTok Downloader༻꧂
🎵 *Caption*: ${desc || "No description"}
🎵 *Quality*: No Watermark
`;

      await hasuki.sendMessage(
        from,
        {
          image: {
            url: "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/LOGO.png?raw=true",
          },
          caption: captionTxt,
        },
        { quoted: mek }
      );

      await hasuki.sendMessage(
        from,
        {
          video: { url: nwm_video_url },
          caption: `*📥 Downloaded without watermark*`,
        },
        { quoted: mek }
      );

      return reply("✨⌘❂⋆ 𝚃𝚑𝚊𝚗𝚔 𝚢𝚘𝚞 𝚏𝚘𝚛 𝚞𝚜𝚒𝚗𝚐 Queen 𝚑𝚊𝚜𝚞𝚔𝚒-𝙼𝙳 ⋆❂⌘✨");
    } catch (e) {
      console.error(e);
      reply(`*Error:* ${e.message || e}`);
    }
  }
);
