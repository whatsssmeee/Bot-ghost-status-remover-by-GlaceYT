const discord = require('discord.js');
const { Client, Intents } = discord;
require('dotenv').config();

const intents = new Intents(32767);  // All privileged intents
intents.add('GUILD_MEMBERS');       // Add GUILD_MEMBERS intent separately

const bot = new Client({
  intents: intents,
});

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}`);
});

bot.on('messageCreate', async (message) => {
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

bot.login(process.env.DISCORD_TOKEN)
  .then(() => console.log('Bot is connected.'))
  .catch(error => console.error('Error connecting bot:', error));
