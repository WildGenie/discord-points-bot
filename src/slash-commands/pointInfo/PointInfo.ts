import { nameAndDescT } from '@translation';
import { SlashCommandBuilder } from 'discord.js';
import { pointInfoHandler } from 'src/feature/pointInfo/pointInfo';

export const PointInfo: DiscordType.ISlashCommand = {
  data: nameAndDescT('pointInfos.command.builder', new SlashCommandBuilder()),
  execute: async ({ client, interaction, t, lng }) => {
    return pointInfoHandler({ client, interaction, t, lng });
  },
};
