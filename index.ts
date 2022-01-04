import * as fs from 'fs';

process.title = 'BOTDISCORD';

require('dotenv').config();
import {Client, Intents, VoiceState} from 'discord.js';

const channelIds: String[] = [];

const client = new Client(
    {intents: [Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_VOICE_STATES]}
);

const eventFiles = fs.readdirSync('./events')
    .filter((file) => file.endsWith('.ts'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, channelIds));
  } else {
    client.on(event.name, (...args) => event.execute(...args, channelIds));
  }
}

client.on('voiceStateUpdate', (oldMember: VoiceState, newMember: VoiceState) => {
  if (oldMember.channelId !== null && channelIds.some((c) => c === oldMember.channelId)) {
    if (oldMember.channel?.members?.size === 0) {
      channelIds.splice(channelIds.indexOf(oldMember.channelId), 1);
      oldMember.channel.setName(oldMember.channel.name.substring('📷 '.length));
      console.log('reseting name');
    }
  } else if (channelIds.some((c) => c === newMember.channelId)) {
    setTimeout(() => {
      if (newMember.selfVideo) return;

      newMember.disconnect('This channel is in Cam Only Mode !');

      newMember?.member?.send(
          {
            content: `You have been disconnected from the channel \`${newMember.channel?.name}\` because it is in **cam only mode**.`,
            embeds: [
              {
                description: 'When a channel is in cam only mode, you have 10 secondes to activate your cam before getting disconnected.',
                color: 'YELLOW',
              },
            ],
          }
      );
    }, 3000);
  }
}
);

client.login(process.env.DISCORD_TOKEN);
