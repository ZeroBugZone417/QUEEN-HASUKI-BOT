module.exports = {
  name: "goodbye",
  description: "Send goodbye message when someone leaves",

  async execute(sock, msg) {
    try {
      if (msg.messageStubType === 29 || msg.messageStubType === 30) { 
        // 29 = remove, 30 = leave
        const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
        const participants = msg.messageStubParameters;

        for (let participant of participants) {
          let user = participant.replace("@s.whatsapp.net", "");
          
          // Goodbye text
          let text = `😢 Goodbye @${user}\n\n` +
                     `We hope you enjoyed your time in *${groupMetadata.subject}* 💔\n\n` +
                     `Powered by *Queen Hasuki Bot* 🤖`;

          // Send logo + caption
          await sock.sendMessage(msg.key.remoteJid, {
            image: { url: "https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/QUEEN%20HASUKI.png?raw=true" },
            caption: text,
            mentions: [participant]
          });
        }
      }
    } catch (e) {
      console.log("Error in goodbye.js:", e);
    }
  }
};
