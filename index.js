const { Client, GatewayIntentBits, ActivityType, TextChannel } = require('discord.js');
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((a) => {
    return GatewayIntentBits[a];
  }),
});
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('YaY Your Bot Status Changed✨');
});
app.listen(port, () => {
  console.log(`🔗 Listening to RTX: http://localhost:${port}`);
  console.log(`🔗 Powered By RTX`);
});

const statusMessage = "Bot made by Requited";
const channelId = '';  // Set your channel ID if you want to send messages to a specific channel
const prefix = '!';  // Set your custom prefix here

const xpCooldowns = new Set();
const xpFilePath = path.join(__dirname, 'xp.json');

// Load XP data
let xpData = {};
if (fs.existsSync(xpFilePath)) {
  xpData = JSON.parse(fs.readFileSync(xpFilePath, 'utf8'));
}

function saveXpData() {
  fs.writeFileSync(xpFilePath, JSON.stringify(xpData, null, 2));
}

async function login() {
  try {
    await client.login(process.env.TOKEN);
    console.log(`\x1b[36m%s\x1b[0m`, `|    🐇 Logged in as ${client.user.tag}`);
  } catch (error) {
    console.error('Failed to log in:', error);
    process.exit(1);
  }
}

client.once('ready', () => {
  console.log(`\x1b[36m%s\x1b[0m`, `|    ✅ Bot is ready as ${client.user.tag}`);
  console.log(`\x1b[36m%s\x1b[0m`, `|    ✨HAPPY NEW YEAR MY DEAR FAMILY`);
  console.log(`\x1b[36m%s\x1b[0m`, `|    ❤️WELCOME TO 2024`);

  client.user.setPresence({
    activities: [{ name: statusMessage, type: ActivityType.Playing }],
    status: 'dnd',
  });

  const textChannel = client.channels.cache.get(channelId);
  if (textChannel instanceof TextChannel) {
    textChannel.send(`Bot status is: ${statusMessage}`);
  }

  logToRenderHost(`Bot is ready and status set to: ${statusMessage}`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
      message.channel.send('Pong!');
    } else if (command === 'status') {
      message.channel.send(`Current status is: ${statusMessage}`);
    } else if (command === 'help') {
      message.channel.send(`Available commands: ${prefix}ping, ${prefix}status, ${prefix}help`);
    } else if (command === 'rank') {
      const userId = message.author.id;
      const userXp = xpData[userId] || { xp: 0, level: 1 };
      message.channel.send(`You are level ${userXp.level} with ${userXp.xp} XP.`);
    }
    // Add more commands as needed
  } else {
    // Handle leveling system
    const userId = message.author.id;
    if (!xpCooldowns.has(userId)) {
      const xpGain = Math.floor(Math.random() * 10) + 1;
      if (!xpData[userId]) {
        xpData[userId] = { xp: 0, level: 1 };
      }

      xpData[userId].xp += xpGain;

      const userLevel = Math.floor(0.1 * Math.sqrt(xpData[userId].xp));
      if (userLevel > xpData[userId].level) {
        xpData[userId].level = userLevel;
        message.channel.send(`${message.author}, you've leveled up to level ${userLevel}!`);
      }

      saveXpData();

      xpCooldowns.add(userId);
      setTimeout(() => {
        xpCooldowns.delete(userId);
      }, 60000); // Cooldown of 1 minute
    }
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ban') {
    // Handle Botghost's /ban command here or let Botghost handle it if implemented there
    // Example:
    const user = interaction.options.getUser('target');
    if (user) {
      const member = interaction.guild.members.cache.get(user.id);
      if (member) {
        await member.ban();
        await interaction.reply(`${user.tag} has been banned`);
      } else {
        await interaction.reply('That user is not in this guild');
      }
    } else {
      await interaction.reply('You didn\'t specify a user');
    }
  }
  // Handle more slash commands if needed
});

function logToRenderHost(message) {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFile(path.join(__dirname, 'logs.txt'), logMessage, (err) => {
    if (err) console.error('Failed to log message to render host:', err);
  });
}

login();
