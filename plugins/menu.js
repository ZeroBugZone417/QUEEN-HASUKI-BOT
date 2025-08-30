const { cmd, commands } = require("../command");

cmd(
  {
    pattern: "menu",
    desc: "Displays command categories",
    category: "main",
    filename: __filename,
  },
  async (danuwa, mek, m, { from, reply }) => {
    try {
      // --- Define categories ---
      const categories = {};
      for (let cmdName in commands) {
        const cmdData = commands[cmdName];
        const cat = cmdData.category?.toLowerCase() || "other";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({
          pattern: cmdData.pattern,
          desc: cmdData.desc || "No description"
        });
      }

      // --- Send category selection buttons ---
      const catButtons = Object.keys(categories).map(c => ({
        buttonId: menu_${c},
        buttonText: { displayText: c.toUpperCase() },
        type: 1
      }));
      // Add Owner button
      catButtons.push({ buttonId: "owner_button", buttonText: { displayText: "👤 Owner" }, type: 1 });

      await danuwa.sendMessage(from, {
        text: "╔════◇📋 QUEEN HASUKI MENU ◇════╗\n💡 Choose a category below:",
        footer: "🛡©Zero Bug Zone 🛡",
        buttons: catButtons,
        headerType: 1
      }, { quoted: mek });

      // --- Handle button clicks ---
      danuwa.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        const selected = msg.message?.buttonsResponseMessage?.selectedButtonId;

        // Owner button
        if (selected === "owner_button") {
          await danuwa.sendMessage(from, {
            text: 👤 Owner Contact Details:\n📱 WhatsApp: wa.me/947XXXXXXXX\n✉ Email: owner@example.com
          }, { quoted: msg });
          return;
        }

        // Category button clicked
        if (selected?.startsWith("menu_")) {
          const catName = selected.replace("menu_", "");
          const cmds = categories[catName] || [];
          if (!cmds.length) return;

          let menuText = ╔════◇📂 *${catName.toUpperCase()} COMMANDS* ◇════╗\n;
          let counter = 1;
          cmds.forEach(c => {
            menuText += ${counter}⃣ .${c.pattern} : ${c.desc}\n;
            counter++;
          });
          menuText += "━━━━━━━━━━━━━━━━━━━━\n";
          menuText += "╚════════════════════════════╝";

          await danuwa.sendMessage(from, {
            text: menuText,
            footer: "🛡©Zero Bug Zone 🛡"
          }, { quoted: msg });
        }
      });

    } catch (err) {
      console.error(err);
      reply("❌ Error generating menu.");
    }
  }
);
