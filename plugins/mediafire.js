const { cmd } = require("../command");
const puppeteer = require("puppeteer");

cmd(
  {
    pattern: "mediafire",
    alias: ["mf", "mfdl"],
    react: "📂",
    desc: "Download Mediafire File",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ *Please provide a valid Mediafire link!*");

      const isValid = /https?:\/\/(www\.)?mediafire\.com\/.+/i.test(q);
      if (!isValid) return reply("⚠️ *Invalid Mediafire URL!*");

      reply("⏳ *Fetching Mediafire file details...*");

      const data = await mediafireDl(q);
      if (!data?.url) return reply("❌ *Failed to fetch download link.*");

      await bot.sendMessage(
        from,
        {
          document: { url: data.url },
          mimetype: "application/octet-stream",
          fileName: data.filename,
          caption: `╔══✦•❀•✦══╗
📂 *MEDIAFIRE DOWNLOADER*
╚══✦•❀•✦══╝

📝 *File:* ${data.filename}
📦 *Size:* ${data.filesize}
✅ *Direct Download Ready*

✨ Powered by Zero Bug Zone ✨`,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("Mediafire Error:", e);
      reply(`❗ *Error:* ${e.message || e}`);
    }
  }
);

async function mediafireDl(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

  // Instead of page.waitForTimeout
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Wait for download button
  await page.waitForSelector("a#downloadButton", { timeout: 20000 });

  // Extract details
  const dlUrl = await page.$eval("a#downloadButton", el => el.href);
  const filename = await page.$eval(".filename", el => el.innerText).catch(() => "Unknown File");
  const filesize = await page.$eval(".dl-info .info", el => el.innerText).catch(() => "Unknown Size");

  await browser.close();

  return { url: dlUrl, filename, filesize };
}

