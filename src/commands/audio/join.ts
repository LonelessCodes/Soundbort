import Discord from "discord.js";

import InteractionRegistry from "../../core/InteractionRegistry.js";
import { TopCommand } from "../../modules/commands/TopCommand.js";
import { EmbedType, replyEmbed, replyEmbedEphemeral } from "../../util/builders/embed.js";

import AudioManager, { JoinFailureTypes } from "../../core/audio/AudioManager.js";

InteractionRegistry.addCommand(new TopCommand({
    name: "join",
    description: "Join the voice channel you are in.",
    async func(interaction: Discord.CommandInteraction) {
        if (!interaction.inGuild() || !interaction.guild) {
            return replyEmbedEphemeral("This commands only works in server channels.", EmbedType.Error);
        }

        const member = await interaction.guild.members.fetch(interaction.member.user.id);
        const subscription = await AudioManager.join(member);

        if (subscription === JoinFailureTypes.FailedNotInVoiceChannel)
            return replyEmbedEphemeral("You must join a voice channel first.", EmbedType.Info);
        if (subscription === JoinFailureTypes.FailedTryAgain)
            return replyEmbedEphemeral("Couldn't join the voice channel you're in... Maybe try again later.", EmbedType.Error);

        return replyEmbed("👍 Joined");
    },
}));
