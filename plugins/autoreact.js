const { cmd } = require("../command");

// =======================
// Auto React System
// =======================
let autoReact = true; // default ON

// Reaction list (Random mode)
const reactions = ["😂", "🔥", "❤️", "👍", "😎", "🥳", "🤯", "💯", "😅", "👀"];

// Keyword based reactions
const keywordReacts = {
  hello: "👋",
  hi: "🙌",
  love: "❤️",
  good: "👍",
  wow: "🤩",
};

// =======================
// Attach Auto React to every incoming message
// =======================
cmd(
  {
    pattern: "autoreact-handler",
    dontAddCommandList: true, // hidden command
  },
  async (bot, mek, m, { body, from }) => {
    try {
      if (!autoReact || !body) return;

      // ✅ Check keyword based react
      for (const key in keywordReacts) {
        if (body.toLowerCase().includes(key)) {
          await bot.sendMessage(from, {
            react: { text: keywordReacts[key], key: mek.key },
          });
          return;
        }
      }

      // ✅ Otherwise random react
      const randomReact = reactions[Math.floor(Math.random() * reactions.length)];
      await bot.sendMessage(from, {
        react: { text: randomReact, key: mek.key },
      });
    } catch (e) {
      console.log("Auto React Error:", e);
    }
  }
);

// =======================
// Auto React Toggle Command
// =======================
cmd(
  {
    pattern: "autoreact",
    desc: "Enable or Disable Auto Reaction",
    category: "fun",
    filename: __filename,
  },
  async (bot, mek, m, { args, reply }) => {
    const choice = (args[0] || "").toLowerCase();

    if (choice === "on") {
      autoReact = true;
      return reply("✅ Auto React is now *ON*");
    } else if (choice === "off") {
      autoReact = false;
      return reply("❌ Auto React is now *OFF*");
    } else {
      return reply(
        `⚙️ Usage: .autoreact on | off\n\n📌 Status: ${
          autoReact ? "ON ✅" : "OFF ❌"
        }`
      );
    }
  }
);
