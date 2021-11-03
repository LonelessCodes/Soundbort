import { SAMPLE_TYPES } from "../../const.js";

import InteractionRegistry from "../../core/InteractionRegistry.js";
import { TopCommand } from "../../modules/commands/TopCommand.js";
import { CommandStringOption } from "../../modules/commands/CommandOption.js";
import { createChoice } from "../../modules/commands/options/createChoice.js";

import { upload } from "../../core/soundboard/methods/upload.js";

InteractionRegistry.addCommand(new TopCommand({
    name: "upload",
    description: "Add a sound sample to your soundboard. Upload the audio file first, then call this command.",
    options: [
        new CommandStringOption({
            name: "name",
            description: "Name for the sample",
            required: true,
        }),
        new CommandStringOption({
            name: "to",
            description: "Choose the soundboard to add the sound to. Defaults to your personal soundboard.",
            choices: [
                createChoice("Upload into your personal soundboard.", SAMPLE_TYPES.USER),
                createChoice("Upload into server soundboard for every member to use.", SAMPLE_TYPES.SERVER),
            ],
        }),
    ],
    async func(interaction) {
        const name = interaction.options.getString("name", true).trim();
        const scope = interaction.options.getString("to", false) as (SAMPLE_TYPES.USER | SAMPLE_TYPES.SERVER | null) || SAMPLE_TYPES.USER;

        await upload(interaction, name, scope);
    },
}));
