const { cmd } = require("../command");
const Jimp = require("jimp"); // Image editing
const fs = require("fs");
const path = require("path");
const { removeBackgroundFromImageUrl } = require("remove.bg"); // Background remover

// ---------------------- Editor Pack Links ----------------------
cmd(
  {
    pattern: "editorpack",
    desc: "Show photo editing commands",
    category: "tools",
    react: "🎨",
    filename: __filename,
  },
  async (bot, mek, m, { reply }) => {
    let msg = `
🎨 *Photo Editing Commands Pack* 🎨

🌀 .blur → Blur image  
⚫ .gray → Grayscale image  
🎭 .invert → Invert colors  
🖼 .mirror → Mirror effect  
📸 .pixel → Pixelate image  
🪄 .removebg → Remove background  

👉 Reply to an *image* with these commands!
`;
    reply(msg);
  }
);

// ---------------------- Image Editor Helper ----------------------
async function editImage(m, effect, reply, bot) {
  try {
    if (!m.quoted || !m.quoted.message.imageMessage)
      return reply("⚠️ Reply to an *image* with this command!");

    let buffer = await m.quoted.download();
    let img = await Jimp.read(buffer);

    switch (effect) {
      case "blur": img.blur(10); break;
      case "gray": img.grayscale(); break;
      case "invert": img.invert(); break;
      case "mirror": img.mirror(true, false); break;
      case "pixel": img.pixelate(10); break;
    }

    let out = path.join(__dirname, "edited.jpg");
    await img.writeAsync(out);

    await bot.sendMessage(m.chat, { image: fs.readFileSync(out) }, { quoted: m });
    fs.unlinkSync(out);
  } catch (e) {
    console.error("Editor Error:", e);
    reply("❌ Failed to edit image!");
  }
}

// ---------------------- Editing Commands ----------------------
["blur", "gray", "invert", "mirror", "pixel"].forEach(cmdName => {
  cmd(
    { pattern: cmdName, desc: `Apply ${cmdName} effect`, category: "tools", filename: __filename },
    async (bot, mek, m, { reply }) => editImage(m, cmdName, reply, bot)
  );
});

// ---------------------- RemoveBG Command ----------------------
cmd(
  {
    pattern: "removebg",
    desc: "Remove background from image",
    category: "tools",
    filename: __filename,
  },
  async (bot, mek, m, { reply }) => {
    try {
      if (!m.quoted || !m.quoted.message.imageMessage)
        return reply("⚠️ Reply to an *image* with `.removebg`!");

      reply("⏳ Removing background...");

      const buffer = await m.quoted.download();
      const inputPath = path.join(__dirname, "input.png");
      const outputPath = path.join(__dirname, "output.png");
      fs.writeFileSync(inputPath, buffer);

      await removeBackgroundFromImageUrl({
        apiKey: "D5GqeGPPy35y4YwoDLnFj2te",
        imageFilePath: inputPath,
        outputFilePath: outputPath,
        size: "auto",
      });

      await bot.sendMessage(
        m.chat,
        { image: fs.readFileSync(outputPath), caption: "✅ Background removed!" },
        { quoted: m }
      );

      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);

    } catch (e) {
      console.error("RemoveBG Error:", e);
      reply("❌ Failed to remove background!");
    }
  }
);
