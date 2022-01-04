import {CategoryChannel, Client, Collection, Guild, VoiceChannel} from 'discord.js';

module.exports = {
  name: 'ready',
  once: true,
  execute(client : Client) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);

    const servers: Collection<string, Guild> = client.guilds.cache;
    const camChannels: VoiceChannel[] = [];

    servers.forEach((s: Guild) => {
      const cat = s.channels.cache.filter(
          (c) => c.type === 'GUILD_CATEGORY' && c.name.startsWith('📷')
      );


      cat.forEach((c ) => {
        (c as CategoryChannel).children.forEach((child) => {
          if (child.type === 'GUILD_VOICE') camChannels.push(child);
        });
      });
    });

    camChannels.forEach((c) => console.log(c.name));
  },
};

