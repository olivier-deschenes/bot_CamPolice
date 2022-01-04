import {Message} from 'discord.js';

module.exports = {
  name: 'messageCreate',
  once: false,
  execute(message : Message, channelIds: String[]) {
    if (message.author.bot) return;

    if (!message.content.startsWith('!cam')) return;

    const channel = message.member?.voice.channel;

    if (!channel || !channel.isVoice()) return;

    if (channelIds.some((c) => c === channel.id)) return;

    channelIds.push(channel.id);

    channel.setName('📷 ' + channel.name);

    message.channel.send(
        `The channel \`${channel.name}\` is now in **Cam only** mode!`
    );

    channel.members.forEach((m) => {
      if (!m.voice.selfVideo) {
        m.voice.disconnect('This channel is in Cam Only Mode !');

        m.send(
            {
              content: `You have been disconnected from the channel \`${channel.name}\` because it is in **cam only mode**.`,
              embeds: [
                {
                  description: 'When a channel is in cam only mode, you have 10 secondes to activate your cam before getting disconnected.',
                  color: 'YELLOW',
                },
              ],
            }
        );
      }
    });
  },
};
