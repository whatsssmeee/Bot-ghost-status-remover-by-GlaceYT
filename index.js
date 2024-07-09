import discord
from discord.ext import commands
import os

TOKEN = os.getenv('DISCORD_TOKEN')

intents = discord.Intents.default()
intents.bans = True  # Enable ban-related events and permissions

bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')

@bot.command()
@commands.has_permissions(administrator=True)
async def unban_all(ctx):
    bans = await ctx.guild.bans()
    for ban_entry in bans:
        user = ban_entry.user
        await ctx.guild.unban(user)
        await ctx.send(f'Unbanned {user.name}#{user.discriminator}')
    await ctx.send('Unbanned all users.')

bot.run(TOKEN)
