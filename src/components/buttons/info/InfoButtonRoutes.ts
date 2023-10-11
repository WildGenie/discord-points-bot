import { setupRoutes } from './routes';

export const InfoButtonRoutes: DiscordType.IButton = {
  customId: 'info',
  execute: async ({ client, interaction, lang }) => {
    const [_, subCustumId] = interaction.customId.split('/');

    const button = setupRoutes.find(({ custumId }) => custumId === subCustumId);

    await button.execute({ client, interaction, lang });
  },
};