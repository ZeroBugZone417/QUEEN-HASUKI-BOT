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

// Auto React Messages
sock.ev.on("messages.upsert", async ({ messages }) => {
  try {
    const msg = messages[0];
    if (!msg.message || !autoReact) return;

    const from = msg.key.remoteJid;
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    // ✅ Check keyword based react
    for (const key in keywordReacts) {
      if (text.toLowerCase().includes(key)) {
        await sock.sendMessage(from, {
          react: { text: keywordReacts[key], key: msg.key },
        });
        return; // stop here if keyword react matched
      }
    }

    // ✅ Otherwise, random react
    const randomReact =
      reactions[Math.floor(Math.random() * reactions.length)];

    await sock.sendMessage(from, {
      react: { text: randomReact, key: msg.key },
    });
  } catch (e) {
    console.log("Auto React Error:", e);
  }
});

// =======================
// Auto React Commands
// =======================

cmd(
  {
    pattern: "autoreact",
    desc: "Enable or Disable Auto Reaction",
    category: "fun",
  },
  async (message, match) => {
    if (match.toLowerCase() === "on") {
      autoReact = true;
      return await message.reply("✅ Auto React is now *ON*");
    } else if (match.toLowerCase() === "off") {
      autoReact = false;
      return await message.reply("❌ Auto React is now *OFF*");
    } else {
      return await message.reply(
        `⚙️ Usage: .autoreact on | off\n\n📌 Status: ${
          autoReact ? "ON ✅" : "OFF ❌"
        }`
      );
    }
  }
);
