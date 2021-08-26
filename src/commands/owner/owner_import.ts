import { createStringOption } from "../../modules/commands/options/createOption";
import { EmbedType, isOwner, replyEmbedEphemeral } from "../../util/util";
import { CustomSample } from "../../core/soundboard/CustomSample";
import { StandardSample } from "../../core/soundboard/StandardSample";
import { Command } from "../../modules/commands/Command";
import { UploadErrors } from "../../core/soundboard/methods/upload";

export default new Command({
    name: "import",
    description: "Import a sample from another user or server to your or your server's soundboard.",
    options: [
        createStringOption("sample_id", "A sample identifier (sXXXXXX). Get the ID of a sample from typing `/info <name>`.", true),
    ],
    async func(interaction) {
        const id = interaction.options.getString("sample_id", true).trim();

        if (!isOwner(interaction.user.id)) {
            return replyEmbedEphemeral("You're not a bot developer, you can't add samples to standard soundboard.", EmbedType.Error);
        }

        const sample_count = await StandardSample.countSamples();
        if (sample_count >= StandardSample.MAX_SLOTS) {
            return replyEmbedEphemeral(UploadErrors.TooManySamples.replace("{MAX_SAMPLES}", StandardSample.MAX_SLOTS.toLocaleString("en")), EmbedType.Error);
        }

        const sample = await CustomSample.findById(id);
        if (!sample) {
            return replyEmbedEphemeral(`Couldn't find sample with id ${id}`, EmbedType.Error);
        }

        if (!sample.importable) {
            return replyEmbedEphemeral("This sample is marked as not importable.", EmbedType.Error);
        }

        if (await StandardSample.findByName(sample.name)) {
            return replyEmbedEphemeral("You already have a sample with this name in your soundboard.", EmbedType.Error);
        }

        const new_sample = await StandardSample.import(sample);

        return new_sample.toEmbed({ description: `Successfully imported sample "${new_sample.name}."`, type: EmbedType.Success });
    },
});
