import Discord from "discord.js";

import InteractionRegistry from "../../core/InteractionRegistry.js";
import { CommandStringOption } from "../../modules/commands/CommandOption.js";
import { TopCommand } from "../../modules/commands/TopCommand.js";
import { EmbedType, replyEmbedEphemeral } from "../../util/builders/embed.js";

import { CustomSample } from "../../core/soundboard/CustomSample.js";
import GuildConfigManager from "../../core/managers/GuildConfigManager.js";
import { search } from "../../core/soundboard/methods/searchMany.js";
import { findOne } from "../../core/soundboard/methods/findOne.js";
import { StandardSample } from "../../core/soundboard/StandardSample.js";

async function canShowDelete(sample: CustomSample | StandardSample, userId: string, guild: Discord.Guild | null) {
    if (sample instanceof CustomSample) {
        // has sample in user soundboard?
        if (sample.isInUsers(userId)) return true;
        // ok then not, but has sample in server soundboard?
        else if (
            guild &&
            sample.isInGuilds(guild.id) &&
            // is a moderator? can remove sample?
            await GuildConfigManager.isModerator(guild, userId)
        ) return true;
    }
    return false;
}

InteractionRegistry.addCommand(new TopCommand({
    name: "info",
    description: "Display information about a sample.",
    options: [
        new CommandStringOption({
            name: "sample",
            description: "A sample name or sample identifier (sXXXXXX)",
            required: true,
            async autocomplete(value, interaction) {
                return await search(value, interaction.user.id, interaction.guild);
            },
        }),
    ],
    async func(interaction) {
        const name = interaction.options.getString("sample", true).trim();

        const sample = await findOne(name, interaction.user.id, interaction.guildId);
        if (!sample) {
            return replyEmbedEphemeral(`Couldn't find sample with name or id ${name}`, EmbedType.Error);
        }

        const show_delete = await canShowDelete(sample, interaction.user.id, interaction.guild);

        return sample.toEmbed({ show_timestamps: true, show_delete: !!show_delete });
    },
}));
