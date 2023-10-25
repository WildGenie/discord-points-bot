import { translation } from '@translation';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { Client } from 'src/structures/Client';

import { PointUnitsModel } from '@discord-point-bot/models';

type PointsInfoEmbedProps = {
  client: Client;
  guildId: string;
  t: typeof translation;
};

export const pointInfoEmbed = async ({ client, guildId, t }: PointsInfoEmbedProps) => {
  const [next, back, cancel, done] = [
    new ButtonBuilder().setCustomId('next').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('back').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('cancel')
      .setStyle(ButtonStyle.Danger)
      .setLabel(t('common.stepByStep')),
    new ButtonBuilder()
      .setCustomId('done')
      .setStyle(ButtonStyle.Success)
      .setLabel(t('common.complete')),
  ];

  const contents = await PointUnitsModel.find({ guildId }).select('description title').lean();
  const contentLength = contents.length;

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(cancel, next);

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(t('pointInfos.title'))
    .setAuthor({
      name: t('pointInfos.author', { name: client.user.displayName }),
      iconURL: client.user.displayAvatarURL({}),
    })
    .setImage(
      'https://cdn.discordapp.com/attachments/745992192891289661/1154089813260111912/image.png',
    )
    .setDescription(contents[0].description);

  const updateComponents = (index, row, embed) => {
    next.setLabel(t('common.next', { first: index + 2, second: contentLength }));
    back.setLabel(t('common.back', { first: index, second: contentLength }));
    row.setComponents(
      index === 0
        ? [cancel, next]
        : index + 1 <= contentLength
        ? [cancel, back, next]
        : [back, done],
    );
    embed.setDescription(contents[index].description);
  };

  updateComponents(0, row, embed);

  return { embed, row, updateComponents };
};
