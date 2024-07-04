const { Client, GatewayIntentBits, ActivityType, TextChannel, Permissions } = require('discord.js');
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
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

const UNVERIFIED_ROLE_ID = '1256969904670769232'; // Replace with your unverified role ID
const VERIFIED_ROLE_ID = '1256969981472800874';   // Replace with your verified role ID

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

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // Command handling
  if (message.content.startsWith('!verify')) {
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return message.reply('You do not have permission to use this command.');
    }

    const guild = message.guild;
    const unverifiedRole = guild.roles.cache.get(UNVERIFIED_ROLE_ID);
    const verifiedRole = guild.roles.cache.get(VERIFIED_ROLE_ID);

    if (!unverifiedRole) {
      return message.reply("The 'unverified' role does not exist.");
    }

    if (!verifiedRole) {
      return message.reply("The 'verified' role does not exist.");
    }

    let assignedCount = 0;

    guild.members.cache.forEach(async member => {
      if (!member.user.bot && !member.roles.cache.has(verifiedRole.id)) {
        if (!member.roles.cache.has(unverifiedRole.id)) {
          await member.roles.add(unverifiedRole);
          assignedCount++;
        }
      }
    });

    message.channel.send(`Assigned the 'unverified' role to ${assignedCount} members without the 'verified' role.`);
  }
});

function logToRenderHost(message) {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFile(path.join(__dirname, 'logs.txt'), logMessage, (err) => {
    if (err) console.error('Failed to log message to render host:', err);
  });
}

login();
