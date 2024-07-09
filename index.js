import discord
from discord.ext import commands, tasks
from itertools import cycle
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

intents = discord.Intents.default()
intents.bans = True  # Enable ban-related events and permissions

bot = commands.Bot(command_prefix='!', intents=intents)

# Status messages
status_messages = cycle(["Playing /help", "Free the guys!"])

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')
    print("✨HAPPY NEW YEAR MY DEAR FAMILY")
    print("❤️WELCOME TO 2024")
    change_status.start()  # Start the status update loop

@bot.command()
@commands.has_permissions(administrator=True)
async def unban_all(ctx):
    bans = await ctx.guild.bans()
    for ban_entry in bans:
        user = ban_entry.user
        await ctx.guild.unban(user)
        await ctx.send(f'Unbanned {user.name}#{user.discriminator}')
    await ctx.send('Unbanned all users.')

@tasks.loop(seconds=10)
async def change_status():
    current_status = next(status_messages)
    await bot.change_presence(activity=discord.Game(name=current_status))
    print(f'Status set to: {current_status}')

bot.run(TOKEN)
