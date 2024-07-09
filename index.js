/**
 ██████╗░████████╗██╗░░██╗           
 ██╔══██╗╚══██╔══╝╚██╗██╔╝          
 ██████╔╝░░░██║░░░░╚███╔╝░          
 ██╔══██╗░░░██║░░░░██╔██╗░          
 ██║░░██║░░░██║░░░██╔╝╚██╗          
 ╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░╚═╝          
  GIT : https://github.com/RTX-GAMINGG/Bot-ghost-status-remover-by-RTX
  DISCORD SERVER : https://discord.gg/FUEHs7RCqz
  YOUTUBE : https://www.youtube.com/channel/UCPbAvYWBgnYhliJa1BIrv0A
 * **********************************************
 *   Code by RTX GAMING
 * **********************************************
 */

const { Client, GatewayIntentBits, TextChannel } = require('discord.js');
require('dotenv').config();
const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((a) => GatewayIntentBits[a]),
});

async function login() {
  try {
    await client.login(process.env.DISCORD_TOKEN);
    console.log(`Logged in as ${client.user.tag}`);
  } catch (error) {
    console.error('Failed to log in:', error);
    process.exit(1);
  }
}

client.on('ready', () => {
  console.log(`Bot is ready as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.content.toLowerCase() === '!unban_all' && message.member.permissions.has('BAN_MEMBERS')) {
    try {
      const bans = await message.guild.bans.fetch();
      bans.forEach(async (banEntry) => {
        await message.guild.bans.remove(banEntry.user.id);
        message.channel.send(`Unbanned ${banEntry.user.tag}`);
      });
      message.channel.send('Unbanned all users.');
    } catch (error) {
      console.error('Error unbanning:', error);
      message.channel.send('Failed to unban users.');
    }
  }
});

login();

/**
 ██████╗░████████╗██╗░░██╗           
 ██╔══██╗╚══██╔══╝╚██╗██╔╝          
 ██████╔╝░░░██║░░░░╚███╔╝░          
 ██╔══██╗░░░██║░░░░██╔██╗░          
 ██║░░██║░░░██║░░░██╔╝╚██╗          
 ╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░╚═╝          
GIT : https://github.com/RTX-GAMINGG/Bot-ghost-status-remover-by-RTX
  DISCORD SERVER : https://discord.gg/FUEHs7RCqz
  YOUTUBE : https://www.youtube.com/channel/UCPbAvYWBgnYhliJa1BIrv0A
 * **********************************************
 *   Code by RTX GAMING
 * **********************************************
 */
