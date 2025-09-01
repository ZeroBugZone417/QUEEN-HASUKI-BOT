const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@adiwajshing/baileys");
const pino = require("pino");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: state,
    logger: pino({ level: "silent" })
  });

  // Auto-seen for all incoming messages
  sock.ev.on("messages.upsert", async (m) => {
    try {
      const msg = m.messages[0];
      if (!msg.key.fromMe) {
        await sock.sendReadReceipt(
          msg.key.remoteJid,
          msg.key.participant || msg.key.remoteJid,
          [msg.key.id]
        );
      }
    } catch (e) {
      console.error("Auto-seen Error:", e);
    }
  });

  sock.ev.on("creds.update", saveCreds);

  console.log("Bot running with silent auto-seen ✅");
}

startBot();

