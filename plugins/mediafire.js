const { cmd } = require("../command");
const { decode } = require("html-entities");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

cmd(
  {
    pattern: "mediafire",
    alias: ["mf"],
    react: "🕒",
    desc: "Download MediaFire File",
    category: "download", // Appears under Download menu
    filename: __filename,
  },
  async (hasuki, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ *Please provide a valid MediaFire link!*");

      const mfRegex = /(https?:\/\/)?(www\.)?mediafire\.com\/.+/;
      if (!mfRegex.test(q)) return reply("⚠️ *Invalid MediaFire URL!*");

      reply("⏳ *Fetching MediaFire file...*");

      // Call MediaFire API
      const api = `https://api.neoxr.my.id/downloader/mediafire?url=${encodeURIComponent(q)}`;
      const res = await fetch(api);

      // --- Check if response is JSON ---
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        return reply(`❌ API did not return JSON:\n${text}`);
      }

      const json = await res.json();
      if (!json?.status || !json?.data) return reply("❌ *Failed to fetch MediaFire file.*");

      // --- Safe destructuring ---
      const data = json.data;
      const title = decode(unescape(data.title || "Unknown"));
      const size = data.size || "Unknown";
      const extension = data.extension || "Unknown";
      const mime = data.mime || "application/octet-stream";
      const url = data.url;
      const packageName = data.package || "N/A";

      if (!url) return reply("❌ *MediaFire file URL not found!*");

      // --- Caption ---
      const caption = `╔══✦•❀•✦══╗
   📁 *MEDIAFIRE DOWNLOADER*
╚══✦•❀•✦══╝

📌 *Name:* ${title}
📦 *Package:* ${packageName}
💾 *Size:* ${size}
📝 *Extension:* ${extension}
🎯 *Mime:* ${mime}

✨ Powered by Zero Bug Zone ✨`;

      // --- Send file with thumbnail ---
      await hasuki.sendMessage(
        from,
        {
          document: { url },
          mimetype: mime,
          fileName: title,
          jpegThumbnail: { url: "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/QUEEN%20HASUKI.png?raw=true" },
          caption,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply(`❗ *Error:* ${e.message || e}`);
    }
  }
);
