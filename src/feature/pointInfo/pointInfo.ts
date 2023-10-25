import { ButtonInteraction, ComponentType } from 'discord.js';

import { pointInfoEmbed } from '@discord-point-bot/components';

export const pointInfoHandler = async ({
  client,
  interaction,
  t,
}: DiscordType.IInteractionArgs<DiscordType.EditReplySupportedInteraction>) => {
  const { embed, row, updateComponents } = await pointInfoEmbed({
    client,
    guildId: interaction.guildId,
    t,
  });

  const question = await interaction.deferReply({ ephemeral: true, fetchReply: true });

  await interaction.editReply({
    components: [row],
    embeds: [embed],
  });

  const collector = question.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id && i.message.id === question.id,
    time: 1000 * 240,
    componentType: ComponentType.Button,
  });

  let index = 0;

  collector.on('collect', async (button: ButtonInteraction) => {
    if (button.customId === 'next') {
      index++;
    } else if (button.customId === 'back') {
      index--;
    } else {
      return collector.stop();
    }

    updateComponents(index, row, embed);

    await interaction.editReply({ embeds: [embed], components: [row] });

    collector.resetTimer();
  });

  collector.on('end', async () => {
    await interaction.deleteReply();
  });
};
