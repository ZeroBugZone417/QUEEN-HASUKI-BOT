const { decode } = require('html-entities');

exports.run = {
    usage: ['mediafire'],
    hidden: ['mf'],
    use: 'link',
    category: 'downloader',
    async: async (m, { client, args, isPrefix, command, users, env, Func, Api }) => {
        try {
            // --- Validate input ---
            if (!args || !args[0]) {
                return client.reply(
                    m.chat,
                    Func.example(
                        isPrefix,
                        command,
                        'https://www.mediafire.com/file/1fqjqg7e8e2v3ao/YOWA.v8.87_By.SamMods.apk/file'
                    ),
                    m
                );
            }

            if (!args[0].match(/https:\/\/www\.mediafire\.com\//i)) {
                return client.reply(m.chat, global.status.invalid, m);
            }

            // --- React while processing ---
            client.sendReact(m.chat, '🕒', m.key);

            // --- Fetch MediaFire info ---
            const json = await Api.neoxr('/mediafire', { url: args[0] });
            if (!json.status) {
                return client.reply(m.chat, Func.jsonFormat(json), m);
            }

            // --- Prepare message ---
            const title = decode(unescape(json.data.title));
            const size = json.data.size;
            const extension = json.data.extension;
            const mime = json.data.mime;

            let text = `乂  *M E D I A F I R E*\n\n`;
            text += `◦  *Name* : ${title}\n`;
            text += `◦  *Size* : ${size}\n`;
            text += `◦  *Extension* : ${extension}\n`;
            text += `◦  *Mime* : ${mime}\n\n`;
            text += 'Zero Bug Zone'; // Footer

            // --- Check file size ---
            const chSize = Func.sizeLimit(size, users.premium ? env.max_upload : env.max_upload_free);
            if (chSize.oversize) {
                const isOver = users.premium
                    ? `💀 File size (${size}) exceeds the maximum limit.`
                    : `⚠️ File size (${size}) exceeds free download limit of ${env.max_upload_free} MB.`;
                return client.reply(m.chat, isOver, m);
            }

            // --- Send file info ---
            await client.sendMessageModify(m.chat, text, m, {
                largeThumb: true,
                thumbnail: 'https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/QUEEN%20HASUKI.png?raw=true'
            });

            // --- Send MediaFire file ---
            await client.sendFile(m.chat, json.data.url, title, '', m);

        } catch (e) {
            console.error(e);
            client.reply(m.chat, Func.jsonFormat(e), m);
        }
    },
    error: false,
    limit: true,
    cache: true,
    location: __filename
};
