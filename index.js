/**
 _____        __           _ 
|  __ \      / _|         | |
| |__) |__ _| |_ __ _  ___| |
|  _  // _` |  _/ _` |/ _ \ |
| | \ \ (_| | || (_| |  __/ |
|_|  \_\__,_|_| \__,_|\___|_|
  
  GIT : https://github.com/rsley/GlaceYT
  
 * **********************************************
 *   Code by Rafael Soley ( github.com/rsley )
 *   Based on GlaceYT's Botghost Remover, but
 *   modified heavily for multi-token ability.
 * **********************************************
 */

const { Client, GatewayIntentBits, ActivityType, TextChannel } = require('discord.js');
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const port = process.env.PORT || 3000;

let count = 0;
app.get('/', (req, res) => {
  count = count + 1;
  res.send({ count });
});

app.listen(port, () => {
  console.log(`🔗 Listening to RTX: http://localhost:${port}`);
  console.log(`🔗 Powered By Rafael's Counting Maker`);
});

const statusMessages = ["Playing Roblox.", "10+ APIs", "Thinking Curved"];
let currentIndex = 0;
const channelId = '';  // Add your channel ID here

async function login(client, token) {
  try {
    await client.login(token);
    console.log(`\x1b[36m%s\x1b[0m`, `| 🐇 Logged in as ${client.user.tag}`);
  } catch (error) {
    console.error('Failed to log in:', error);
    process.exit(1);
  }
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';

      // A chunk of data has been received
      res.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          statusText: res.statusMessage,
          text: () => Promise.resolve(data),
          json: () => Promise.resolve(JSON.parse(data))
        });
      });
    });

    // Handle any errors
    req.on('error', (error) => {
      reject(error);
    });
  });
}

function updateStatusAndSendMessages(client) {
  const currentStatus = statusMessages[currentIndex];
  const nextStatus = statusMessages[(currentIndex + 1) % statusMessages.length];

  client.user.setPresence({
    activities: [{ name: currentStatus, type: ActivityType.Custom }],
    status: 'dnd',
  });

  const textChannel = client.channels.cache.get(channelId);

  if (textChannel instanceof TextChannel) {
    textChannel.send(`Bot status is: ${currentStatus}`);
  }

  currentIndex = (currentIndex + 1) % statusMessages.length;
  fetch('https://randomrequests.onrender.com?currentIndex=currentIndex')
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

// Automatically create clients for all TOKENs in .env file
const clients = [];
for (const key in process.env) {
  if (key.startsWith('TOKEN')) {
    const client = new Client({ intents: Object.keys(GatewayIntentBits).map(key => GatewayIntentBits[key]) });
    clients.push({ client, token: process.env[key] });
  }
}

clients.forEach(({ client, token }) => {
  client.once('ready', () => {
    console.log(`\x1b[36m%s\x1b[0m`, `| ✅ Bot is ready as ${client.user.tag}`);
    console.log(`\x1b[36m%s\x1b[0m`, `| ✨HAPPY COUNTING!`);
    updateStatusAndSendMessages(client);

    setInterval(() => {
      updateStatusAndSendMessages(client);
    }, 10000);
  });

  login(client, token);
});
