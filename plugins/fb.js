const Aqua = require('../events');
const { MessageType, Mimetype } = require('@adiwajshing/baileys');
const axios = require('axios');
const Config = require('../config');
let wk = Config.WORKTYPE == 'public' ? false : true
const Language = require('../language');
const Lang = Language.getString('facebook');
Aqua.addCommand({ pattern: 'fb ?(.*)', fromMe: wk, desc:Lang.FB_DESC, deleteCommand: false }, async (message, match) => {
   const fblink = match[1]
   if (!fblink) return await message.client.sendMessage(message.jid,Lang.N_FB, MessageType.text, { quoted: message.data });
  var load= await message.client.sendMessage(message.jid,Lang.FB_DOWN, MessageType.text, { quoted: message.data });
  await axios.get(`https://sanuw-api.herokuapp.com/docs/download/fb?url=${fblink}&apikey=sanuwa`).then(async (response) => {
    if(!response.data.status) {
       const res =  await axios.get(`https://sanuw-api.herokuapp.com/docs/download/facebook?url=${fblink}&apikey=sanuwa`)
        const link = res.data.result.HD_URL
       if(!link.includes('https')) {
          const res3 = await axios.get(`https://masgimenz.my.id/facebook/?url=${match[1]}`)
          const status = res3.data.status
          if(!status == true) {  return await message.client.sendMessage(message.jid,Lang.E_FB, MessageType.text, { quoted: message.data }); }
          else {
    var up= await message.client.sendMessage(message.jid,Lang.FB_UP, MessageType.text, { quoted: message.data });
    await message.client.deleteMessage(message.jid, {id: load.key.id, remoteJid: message.jid, fromMe: true}) ; 
    var msg = ''
     if (Config.DETAILS == 'true') msg = '┌───[🐋𝙰𝚀𝚄𝙰𝙱𝙾𝚃🐋]\n\n  *📥FACEBOOK DOWNLODER*\n\n│🎪ᴛɪᴛʟᴇ: ' + res3.data.title + '\n\n└───────────◉'
     if (Config.DETAILS == 'false') msg = Config.CAPTION       
    const viddata = await axios.get(res3.data.videoUrl, { responseType: 'arraybuffer'}); 
    await message.sendMessage(Buffer.from(viddata.data), MessageType.video, { caption: msg, quoted: message.data}); 
    await message.client.deleteMessage(message.jid, {id: up.key.id, remoteJid: message.jid, fromMe: true}) ;
          
          }
         
   
        } else { 
           var up= await message.client.sendMessage(message.jid,Lang.FB_UP, MessageType.text, { quoted: message.data });
      await message.client.deleteMessage(message.jid, {id: load.key.id, remoteJid: message.jid, fromMe: true}) ; 
    var msg = ''
      if (Config.DETAILS == 'true') msg = '┌───[🐋𝙰𝚀𝚄𝙰𝙱𝙾𝚃🐋]\n\n  *📥FACEBOOK DOWNLODER*\n\n│🎭ᴜᴘʟᴏᴀᴅᴇʀ: ' + res.data.result.author + '\n\n│🎪ᴛɪᴛʟᴇ: ' + res.data.result.title + '\n\n└───────────◉'
      if (Config.DETAILS == 'false') msg = Config.CAPTION       
     const viddata = await axios.get(res.data.result.HD_URL, { responseType: 'arraybuffer'}); 
    await message.sendMessage(Buffer.from(viddata.data), MessageType.video, { caption: msg, quoted: message.data}); 
    await message.client.deleteMessage(message.jid, {id: up.key.id, remoteJid: message.jid, fromMe: true}) ;
        }
       }
     else { 
      
     var up= await message.client.sendMessage(message.jid,Lang.FB_UP, MessageType.text, { quoted: message.data });
      await message.client.deleteMessage(message.jid, {id: load.key.id, remoteJid: message.jid, fromMe: true}) ; 
     var msg = ''
      if (Config.DETAILS == 'true')  msg = '┌───[🐋𝙰𝚀𝚄𝙰𝙱𝙾𝚃🐋]\n\n  *📥FACEBOOK DOWNLODER*\n\n│🎪ᴛɪᴛʟᴇ: ' + response.data.title + '\n\n└───────────◉'
      if (Config.DETAILS == 'false') msg = Config.CAPTION  
     const viddata = await axios.get(response.data.result[0].url, { responseType: 'arraybuffer'}); 
    await message.sendMessage(Buffer.from(viddata.data), MessageType.video, { caption: msg, quoted: message.data}); 
    await message.client.deleteMessage(message.jid, {id: up.key.id, remoteJid: message.jid, fromMe: true}) ;
  }
    })})
        const tempFile = path.join(tmpDir, `fb_${Date.now()}.mp4`);

        // Download the video
        const videoResponse = await axios({
            method: 'GET',
            url: fbvid,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Range': 'bytes=0-',
                'Connection': 'keep-alive',
                'Referer': 'https://www.facebook.com/'
            }
        });

        const writer = fs.createWriteStream(tempFile);
        videoResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Check if file was downloaded successfully
        if (!fs.existsSync(tempFile) || fs.statSync(tempFile).size === 0) {
            throw new Error('Failed to download video');
        }

        // Send the video
        await sock.sendMessage(chatId, {
            video: { url: tempFile },
            mimetype: "video/mp4",
            caption: "𝑫𝑶𝑾𝑵𝑳𝑶𝑨𝑫𝑬𝑫 𝑩𝒀 𝑸𝑼𝑬𝑬𝑵 𝑯𝑨𝑺𝑼𝑲𝑰"
        }, { quoted: message });

        // Clean up temp file
        try {
            fs.unlinkSync(tempFile);
        } catch (err) {
            console.error('Error cleaning up temp file:', err);
        }

    } catch (error) {
        console.error('Error in Facebook command:', error);
        await sock.sendMessage(chatId, { 
            text: "An error occurred. API might be down. Error: " + error.message
        });
    }
}

module.exports = facebookCommand; 
