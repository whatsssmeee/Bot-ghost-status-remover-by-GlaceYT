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
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    message.channel.send('Pong!');
  } else if (command === 'status') {
    message.channel.send(`Current status is: ${statusMessage}`);
  } else if (command === 'help') {
    message.channel.send(`Available commands: ${prefix}ping, ${prefix}status, ${prefix}help`);
  }
  // Add more commands as needed
});

function logToRenderHost(message) {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFile(path.join(__dirname, 'logs.txt'), logMessage, (err) => {
    if (err) console.error('Failed to log message to render host:', err);
  });
}

login();
