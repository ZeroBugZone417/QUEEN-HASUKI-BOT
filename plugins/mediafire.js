const { cmd } = require("../command");
const { decode } = require("html-entities");
const puppeteer = require("puppeteer");

cmd(
  {
    pattern: "mediafire",
    alias: ["mf"],
    react: "🕒",
    desc: "Download MediaFire File",
    category: "download",
    filename: __filename,
  },
  async (hasuki, mek, m, { from, q, reply, users, env }) => {
    try {
      if (!q) return reply("❌ *Please provide a valid MediaFire link!*");

      const mfRegex = /(https?:\/\/)?(www\.)?mediafire\.com\/.+/;
      if (!mfRegex.test(q)) return reply("⚠️ *Invalid MediaFire URL!*");

      reply("⏳ *Fetching MediaFire file…*");

      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
      const page = await browser.newPage();
      await page.goto(q, { waitUntil: "networkidle2" });

      // Get download link
      const downloadUrl = await page.$eval(
        'a#downloadButton',
        (el) => el.href
      );
      const title = await page.$eval('div.filename > div > span', (el) => el.textContent.trim());
      const sizeText = await page.$eval('div.filename > div > span.size', (el) => el.textContent.trim());
      await browser.close();

      if (!downloadUrl) return reply("❌ *Failed to get MediaFire download link!*");

      // Convert size text to MB number for comparison
      let sizeMB = 0;
      if (sizeText.toLowerCase().includes("kb")) {
        sizeMB = parseFloat(sizeText) / 1024;
      } else if (sizeText.toLowerCase().includes("mb")) {
        sizeMB = parseFloat(sizeText);
      } else if (sizeText.toLowerCase().includes("gb")) {
        sizeMB = parseFloat(sizeText) * 1024;
      }

      const maxSize = users.premium ? env.max_upload : env.max_upload_free;
      if (sizeMB > maxSize) {
        return reply(`⚠️ File size (${sizeText}) exceeds the maximum limit of ${maxSize} MB for your account type.`);
      }

      // Caption
      const caption = `╔══✦•❀•✦══╗
   📁 *MEDIAFIRE DOWNLOADER*
╚══✦•❀•✦══╝

📌 *Name:* ${decode(title)}
💾 *Size:* ${sizeText}
✨ Powered by Zero Bug Zone ✨`;

      // Send file
      await hasuki.sendMessage(
        from,
        {
          document: { url: downloadUrl },
          fileName: decode(title),
          caption,
          jpegThumbnail: { url: "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/QUEEN%20HASUKI.png?raw=true" },
        },
        { quoted: mek }
      );

    } catch (e) {
      console.error(e);
      reply(`❗ *Error:* ${e.message || e}`);
    }
  }
);
