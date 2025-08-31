const { cmd } = require("../command");
const axios = require("axios");

// විහිළුවක්
cmd(
  {
    pattern: "joke",
    desc: "සිංහල විහිළුවක් ගන්න",
    category: "fun",
    filename: __filename,
  },
  async (bot, mek, m, { reply }) => {
    try {
      const jokes = [
        "ගුරුතුමිය: නුගත්කම කියන්නේ මොකද්ද? 👩‍🏫\nපුතා: මම දන්නෙ නෑ ගුරුතුමිය. 🤣",
        "හෙට ඉස්කෝලේ යන්නැතිකම් පරීක්ෂණය බොහෝ දෙනාට සාර්ථකයි! 😂",
        "අම්මලා දන්නා එකම විද්‍යාව ‘WiFi’ කපාගන්න එක 😅",
      ];
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      reply(`🤣 *විහිළුවක්:* \n\n${joke}`);
    } catch (e) {
      reply("❌ විහිළුවක් ගන්න අසාර්ථකයි!");
    }
  }
);

// Meme එකක්
cmd(
  {
    pattern: "meme",
    desc: "Random meme එකක්",
    category: "fun",
    filename: __filename,
  },
  async (bot, mek, m, { from, reply }) => {
    try {
      const res = await axios.get("https://meme-api.com/gimme");
      const meme = res.data;
      await bot.sendMessage(from, { image: { url: meme.url }, caption: `🤣 ${meme.title}` }, { quoted: mek });
    } catch (e) {
      reply("❌ Meme එකක් ගන්න බැරිවුණා!");
    }
  }
);

// අහඹු Quote
cmd(
  {
    pattern: "quote",
    desc: "Motivation Quote එකක්",
    category: "fun",
    filename: __filename,
  },
  async (bot, mek, m, { reply }) => {
    try {
      const res = await axios.get("https://api.quotable.io/random");
      reply(`💡 *Quote:* \n\n"${res.data.content}"\n- ${res.data.author}`);
    } catch (e) {
      reply("❌ Quote එකක් ගන්න අසාර්ථකයි!");
    }
  }
);
