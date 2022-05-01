import { isOwner } from "../../util/util";

import InteractionRegistry from "../../core/InteractionRegistry";
import { EmbedType, replyEmbedEphemeral } from "../../util/builders/embed";
import { SlashCommand } from "../../modules/commands/SlashCommand";
import { SlashCommandPermissions } from "../../modules/commands/permission/SlashCommandPermissions";

// import commands. We can do this, because they don't register any commands by themselves,
// so if they're already imported by the Core it doesn't matter
import reboot_cmd from "./owner_reboot";
import blacklist_cmd from "./owner_blacklist";
import upload_standard_cmd from "./owner_upload";
import delete_cmd from "./owner_delete";
import import_cmd from "./owner_import";

InteractionRegistry.addCommand(new SlashCommand({
    name: "owner",
    description: "A set of owner commands.",
    commands: [
        blacklist_cmd,
        upload_standard_cmd,
        delete_cmd,
        import_cmd,
        reboot_cmd,
    ],
    permissions: SlashCommandPermissions.OWNER,
    async middleware(interaction) {
        if (isOwner(interaction.user.id)) return true;

        await interaction.reply(replyEmbedEphemeral("You need to be a bot developer for that.", EmbedType.Error));
        return false;
    },
}));
