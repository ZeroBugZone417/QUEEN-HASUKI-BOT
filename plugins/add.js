const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

// Path to JSON file
const dataFile = path.join(__dirname, "../lib/added_numbers.json");

// Ensure data file exists
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify([]));

// Helper functions to read/write JSON
const readData = () => JSON.parse(fs.readFileSync(dataFile));
const writeData = (data) => fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

cmd(
  {
    pattern: "add",
    react: "➕",
    desc: "Add a number to the bot's list",
    category: "main",
    filename: __filename,
    fromMe: false,
  },
  async (malvin, mek, m, { text, reply }) => {
    try {
      if (!text) return reply("❌ Usage: .add <phone_number>\nExample: .add 94771234567");

      let number = text.replace(/\D/g, ""); // remove non-numeric chars
      let data = readData();

      if (data.includes(number)) {
        return reply(`⚠️ Number already added: ${number}`);
      }

      data.push(number);
      writeData(data);

      await reply(`✅ Number added successfully: ${number}\nTotal numbers: ${data.length}`);
    } catch (e) {
      console.error("❌ Error in .add command:", e);
      reply("❌ Failed to add number!");
    }
  }
);
