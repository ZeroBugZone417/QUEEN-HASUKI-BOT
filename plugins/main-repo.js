const fetch = require('node-fetch');
const config = require('../config');    
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch information about a GitHub repository.",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT';

    try {
        // Extract username and repo name from the URL
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);

        // Fetch repository details using GitHub API
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        
        if (!response.ok) {
            throw new Error(`GitHub API request failed with status ${response.status}`);
        }

        const repoData = await response.json();

        // Stylish formatted repository information
        const formattedInfo = `
╭━━━〔 *📂 Repository Info* 〕━━━╮

🔹 *Bot Name* : ${repoData.name}
👤 *Owner*    : ${repoData.owner.login}
⭐ *Stars*    : ${repoData.stargazers_count}
🍴 *Forks*    : ${repoData.forks_count}

🌐 *GitHub Link* :
${repoData.html_url}

📝 *Description* :
${repoData.description || 'No description'}

╰━━━━━━━━━━━━━━━━━━━━━━━╯
✨ Don't forget to ⭐ star & 🍴 fork!

> *© Powered By 𝙭𝙞𝙤𝙣 🖤*
`;

        // Send image with stylish caption
        await conn.sendMessage(from, {
            image: { url: `https://github.com/ZeroBugZone417/QUEEN-HASUKI-BOT/blob/main/lib/QUEEN%20HASUKI.png?raw=true` },
            caption: formattedInfo,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '',
                    newsletterName: 'XIONX',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in repo command:", error);
        reply("❌ Sorry, something went wrong while fetching the repository information. Please try again later.");
    }
});
