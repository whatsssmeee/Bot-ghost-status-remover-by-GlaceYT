const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences // Ensure this is included
  ],
});

const statusMessages = ["Made by Requited", "Free the guys!"];
let currentIndex = 0;

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  
  // Function to update the bot's status
  function updateStatus() {
    const currentStatus = statusMessages[currentIndex];
    client.user.setPresence({
      activities: [{ name: currentStatus, type: ActivityType.Playing }],
      status: 'online'
    }).then(() => console.log(`Presence set to: Playing ${currentStatus}`))
      .catch(console.error);

    // Move to the next status
    currentIndex = (currentIndex + 1) % statusMessages.length;
  }

  // Initial status update
  updateStatus();

  // Update status every 10 seconds
  setInterval(updateStatus, 10000);
});

// Log the bot in
client.login(process.env.TOKEN).catch(console.error);
