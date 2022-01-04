import * as fs from 'fs';

require('dotenv').config();
import {Client, Intents} from 'discord.js';

const client = new Client(
    {intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]}
);

const eventFiles = fs.readdirSync('./events')
    .filter((file) => file.endsWith('.ts'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.DISCORD_TOKEN);
