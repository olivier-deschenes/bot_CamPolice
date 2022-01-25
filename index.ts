require('dotenv').config();
import {CategoryChannel, Client, Collection, Guild, Intents, VoiceState} from 'discord.js';

const client = new Client(
    {intents: [Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_VOICE_STATES]}
);

type CameraChannelsListType = {serverId: string, channelIds: string[]}[]

const cameraChannelsList: CameraChannelsListType = [];

client.on('voiceStateUpdate', (oldMember: VoiceState, newMember: VoiceState) => {
  const userServerId = oldMember.guild.id;

  const camChannels = cameraChannelsList.find((serv) => serv.serverId === userServerId);

  if (!camChannels) return;

  if (camChannels.channelIds.some((c) => c === newMember.channelId)) {
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
    }, 5000);
  }
}
);

client.once('ready', (client: Client) => {
  console.log(`Ready! Logged in as ${client.user?.tag}`);

  const servers: Collection<string, Guild> = client.guilds.cache;


  servers.forEach((s: Guild) => {
    const cat = s.channels.cache.filter(
        (c) => c.type === 'GUILD_CATEGORY' && c.name.startsWith('📷')
    );

    cat.forEach((c ) => {
      (c as CategoryChannel).children.forEach((child) => {
        if (child.type === 'GUILD_VOICE') {
          const i = cameraChannelsList.findIndex((server) => s.id === server.serverId);
          const serverChan = cameraChannelsList[i] ?? {serverId: s.id, channelIds: []};

          if (i === -1) cameraChannelsList.push(serverChan);
          else cameraChannelsList[i] = serverChan;

          cameraChannelsList.find((c) => c.serverId === s.id)?.channelIds.push(child.id);
        }
      });
    });
  });
});

client.login(process.env.DISCORD_TOKEN);
