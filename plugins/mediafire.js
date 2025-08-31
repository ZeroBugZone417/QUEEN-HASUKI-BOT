const { cmd } = require("../command");
const { decode } = require("html-entities");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

cmd(
  {
    pattern: "mediafire",
    alias: ["mf"],
    react: "🕒",
    desc: "Download MediaFire File",
    category: "downloader",
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
      const json = await res.json();

      if (!json?.status) return reply("❌ *Failed to fetch MediaFire file.*");

      const { title, size, extension, mime, url, package: packageName } = json.data;

      const caption = `╔══✦•❀•✦══╗
   📁 *MEDIAFIRE DOWNLOADER*
╚══✦•❀•✦══╝

📌 *Name:* ${decode(unescape(title))}
📦 *Package:* ${packageName || "N/A"}
💾 *Size:* ${size}
📝 *Extension:* ${extension}
🎯 *Mime:* ${mime}

✨ Powered by Zero Bug Zone ✨`;

      // Send file with thumbnail
      await hasuki.sendMessage(
        from,
        {
          document: { url },
          mimetype: mime,
          fileName: decode(unescape(title)),
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

};
