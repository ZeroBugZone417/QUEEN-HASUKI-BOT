const { cmd } = require("../command");
const fs = require("fs");
const path = "./lib/added_numbers.json";

cmd(
  {
    pattern: "add",
    desc: "Add a phone number",
    category: "main",
    filename: __filename,
  },
  async (hasuki, mek, m, { from, q, reply }) => {
    try {
      if (!q) 
        return reply(
          "❌ Usage: .add <phone_number>\nExample: .add 947699xxxxx"
        );

      // Load JSON file
      let numbers = [];
      if (fs.existsSync(path)) {
        const data = fs.readFileSync(path, "utf8");
        numbers = JSON.parse(data || "[]");
      }

      // Check if number already added
      if (numbers.includes(q)) {
        return reply("⚠️ This number is already added!");
      }

      // Add number
      numbers.push(q);
      fs.writeFileSync(path, JSON.stringify(numbers, null, 2));

      return reply(`✅ Number added successfully: ${q}`);
    } catch (err) {
      console.error(err);
      reply("❌ Error adding number.");
    }
  }
);
