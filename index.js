const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

const fs = require('fs');
const P = require('pino');
const express = require('express');
const axios = require('axios');
const path = require('path');
const qrcode = require('qrcode-terminal');

const config = require('./config');
const { sms, downloadMediaMessage } = require('./lib/msg');
const {
  getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson
} = require('./lib/functions');
const { File } = require('megajs');
const { commands, replyHandlers } = require('./command');

const app = express();
const port = process.env.PORT || 8000;

const prefix = '.';
const ownerNumber = ['94789737967'];
const credsPath = path.join(__dirname, '/auth_info_baileys/creds.json');

async function ensureSessionFile() {
  if (!fs.existsSync(credsPath)) {
    if (!config.SESSION_ID) {
      console.error('❌ SESSION_ID env variable is missing. Cannot restore session.');
      process.exit(1);
    }

    console.log('🔄 creds.json not found. Downloading session from MEGA...');

    const sessdata = config.SESSION_ID;
    const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);

    // Note: megajs download callback returns Buffer `data`
    filer.download((err, data) => {
      if (err) {
        console.error('❌ Failed to download session file from MEGA:', err);
        process.exit(1);
      }

      fs.mkdirSync(path.join(__dirname, '/auth_info_baileys/'), { recursive: true });
      fs.writeFileSync(credsPath, data);
      console.log('✅ Session downloaded and saved. QUEEN HASUKI-V1 Restarting bot...');
      setTimeout(() => {
        connectToWA();
      }, 2000);
    });
  } else {
    setTimeout(() => {
      connectToWA();
    }, 1000);
  }
}

async function connectToWA() {
  try {
    console.log('Connecting QUEEN HASUKI-V1 🧬...');
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, '/auth_info_baileys/'));
    const { version } = await fetchLatestBaileysVersion();

    const hasuki = makeWASocket({
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
      browser: Browsers.macOS('Firefox'),
      auth: state,
      version,
      syncFullHistory: true,
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true
    });

    hasuki.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update || {};
      if (connection === 'close') {
        const code = lastDisconnect?.error?.output?.statusCode;
        if (code !== DisconnectReason.loggedOut) {
          connectToWA();
        } else {
          console.error('❌ Logged out from WhatsApp. Delete auth folder to relogin.');
        }
      } else if (connection === 'open') {
        console.log('✅ QUEEN HASUKI-V1 connected to WhatsApp');

        const up = `QUEEN HASUKI-V1 connected ✅

PREFIX: ${prefix}`;
        try {
          await hasuki.sendMessage(ownerNumber[0] + '@s.whatsapp.net', {
            image: {
              url: 'https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/Zero%20Bug%20Zone.png?raw=true'
            },
            caption: up
          });
        } catch (err) {
          console.warn('⚠️ Failed to send owner connect message:', err?.message || err);
        }

        // Load plugins
        fs.readdirSync('./plugins/').forEach((plugin) => {
          if (path.extname(plugin).toLowerCase() === '.js') {
            try {
              require(`./plugins/${plugin}`);
            } catch (e) {
              console.error('[PLUGIN LOAD ERROR]', plugin, e);
            }
          }
        });
      }
    });

    hasuki.ev.on('creds.update', saveCreds);

    hasuki.ev.on('messages.upsert', async ({ messages }) => {
      if (!messages || !messages.length) return;

      for (const msg of messages) {
        // ack status updates quietly
        if (msg.messageStubType === 68) {
          try { await hasuki.sendMessageAck(msg.key); } catch {}
        }
      }

      const mek = messages[0];
      if (!mek || !mek.message) return;

      // unwrap ephemeral
      mek.message =
        getContentType(mek.message) === 'ephemeralMessage'
          ? mek.message.ephemeralMessage.message
          : mek.message;

      if (mek.key?.remoteJid === 'status@broadcast') return;

      const m = sms(hasuki, mek);
      const type = getContentType(mek.message);
      const from = mek.key.remoteJid;

      const body =
        type === 'conversation'
          ? mek.message.conversation
          : mek.message[type]?.text ||
            mek.message[type]?.caption ||
            '';

      const isCmd = typeof body === 'string' && body.startsWith(prefix);
      const commandName = isCmd ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : '';
      const args = (typeof body === 'string' ? body : '').trim().split(/ +/).slice(1);
      const q = args.join(' ');

      const sender = mek.key.fromMe ? hasuki.user.id : (mek.key.participant || mek.key.remoteJid);
      const senderNumber = (sender || '').split('@')[0];
      const isGroup = from.endsWith('@g.us');
      const botNumber = hasuki.user.id.split(':')[0];
      const pushname = mek.pushName || 'Sin Nombre';
      const isMe = botNumber.includes(senderNumber);
      const isOwner = ownerNumber.includes(senderNumber) || isMe;
      const botNumber2 = await jidNormalizedUser(hasuki.user.id);

      const groupMetadata = isGroup ? await hasuki.groupMetadata(from).catch(() => null) : null;
      const groupName = isGroup && groupMetadata ? groupMetadata.subject : '';
      const participants = isGroup && groupMetadata ? groupMetadata.participants : [];
      const groupAdmins = isGroup ? await getGroupAdmins(participants) : [];
      const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
      const isAdmins = isGroup ? groupAdmins.includes(sender) : false;

      const reply = (text) => hasuki.sendMessage(from, { text }, { quoted: mek });

      // Run commands
      if (isCmd) {
        const cmd = commands.find(
          (c) => c.pattern === commandName || (Array.isArray(c.alias) && c.alias.includes(commandName))
        );
        if (cmd) {
          if (cmd.react) {
            try { await hasuki.sendMessage(from, { react: { text: cmd.react, key: mek.key } }); } catch {}
          }
          try {
            await cmd.function(hasuki, mek, m, {
              from, quoted: mek, body, isCmd, command: commandName, args, q,
              isGroup, sender, senderNumber, botNumber2, botNumber, pushname,
              isMe, isOwner, groupMetadata, groupName, participants, groupAdmins,
              isBotAdmins, isAdmins, reply
            });
          } catch (e) {
            console.error('[PLUGIN ERROR]', e);
          }
        }
      }

      // Run passive/reply handlers
      const replyText = body;
      if (replyText) {
        for (const handler of replyHandlers) {
          try {
            if (handler.filter(replyText, { sender, message: mek })) {
              await handler.function(hasuki, mek, m, {
                from, quoted: mek, body: replyText, sender, reply
              });
              break;
            }
          } catch (e) {
            console.log('Reply handler error:', e);
          }
        }
      }
    });
  } catch (err) {
    console.error('❌ Fatal connect error:', err);
  }
}

ensureSessionFile();

app.get('/', (_req, res) => {
  res.send('Hey, QUEEN HASUKI-V1 started✅');
});

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
