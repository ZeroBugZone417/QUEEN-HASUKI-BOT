const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'add',
  description: 'Add a phone number (Admin only)',
  async execute(m, args, hasuki) {
    try {
      if (!m.isGroup) return m.reply('❌ This command only works in groups.');

      // Get group metadata
      const groupMetadata = await hasuki.groupMetadata(m.chat);
      const admins = groupMetadata.participants
        .filter(p => p.admin || p.superAdmin)
        .map(p => p.id);

      // Check if sender is admin
      if (!admins.includes(m.sender)) {
        return m.reply('⚠ Only admins can use this command!');
      }

      // Validate number argument
      const number = args[0];
      if (!number) return m.reply('❌ Usage: .add <phone_number>\nExample: .add 94771234567');

      // Load current numbers
      const filePath = path.join(__dirname, 'lib', 'added_numbers.json');
      let data = [];
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        try {
          data = JSON.parse(fileContent);
        } catch (err) {
          data = [];
        }
      }

      // Check if number already exists
      if (data.includes(number)) return m.reply('⚠ This number is already added.');

      // Add number and save
      data.push(number);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      m.reply(`✅ Number ${number} added successfully!`);

    } catch (err) {
      console.error(err);
      m.reply('❌ Something went wrong while adding the number.');
    }
  }
};

