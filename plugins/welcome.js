module.exports = {
  name: "welcome",
  description: "Send welcome message when someone joins",

  async execute(sock, msg) {
    try {
      if (msg.messageStubType === 27 || msg.messageStubType === 28) { 
        // 27 = add, 28 = invite
        const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
        const participants = msg.messageStubParameters;

        for (let participant of participants) {
          let user = participant.replace("@s.whatsapp.net", "");
          
          // Welcome text
          let text = `👑 Welcome @${user} to *${groupMetadata.subject}* 🎉\n\n` +
                     `📌 Please follow the rules and enjoy the group ❤️\n\n` +
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
      console.log("Error in welcome.js:", e);
    }
  }
};
